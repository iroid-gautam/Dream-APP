import moment from "moment";
import User from "../../model/user";
import Otp from "../../model/otp";
import EmailUpdateRequest from "../../model/emailUpdateRequest";
import AccessToken from "../../model/accessToken";
import RefreshToken from "../../model/refreshToken";
import CommonService from "../common/services/common.service";
import {
  BadRequestException,
  ForbiddenException,
  PreconditionFailedException,
  UnauthorizedException,
} from "../common/error-exceptions";
import {
  AUTH_PROVIDER,
  EMAIL_UPDATE,
  OTP_TYPE_CODE_TO_VALUE,
  OTPTYPE,
} from "../common/constants/constant";
import AuthHelper from "../common/auth.helper";
import sendMail from "../common/middlewares/send-mail.middleware";
import { randomStringGenerator } from "../common/helper";
import GetUserResource from "./resources/getUserResource";
import logger from "../common/logger";

const expiresInSeconds = 900;
const authLogger = logger.withLabel("AUTH");
const currentEnv = `${process.env.NODE_ENV || process.env.ENV || ""}`.toLowerCase();
const isDevelopmentEnv = currentEnv === "development";

class AuthService {
  static getSocialProviderConfig(provider) {
    const providerConfig = {
      [AUTH_PROVIDER.GOOGLE]: {
        strategy: AUTH_PROVIDER.GOOGLE,
        authOptions: { scope: ["profile", "email"] },
      },
      [AUTH_PROVIDER.FACEBOOK]: {
        strategy: AUTH_PROVIDER.FACEBOOK,
        authOptions: { scope: ["email"] },
      },
    };

    const config = providerConfig[provider];
    if (!config) {
      throw new BadRequestException("Unsupported social auth provider.");
    }

    return config;
  }

  static async register(data) {
    const email = data.email.toLowerCase();
    const fullName = `${data.firstName} ${data.lastName}`.trim();
    let user = await CommonService.findOne(User, { email });

    if (user?.isDeleted) {
      user.firstName = data.firstName || user.firstName;
      user.lastName = data.lastName || user.lastName;
      user.name = fullName || user.name;
      user.termCondition = data.termCondition ?? user.termCondition;
      user.providerType = AUTH_PROVIDER.LOCAL;
      user.providerId = null;
      user.isDeleted = false;
      user.deletedAt = null;
      user.isVerified = false;
      user.lastLoginProvider = AUTH_PROVIDER.LOCAL;

      await this.generateAndSendOtp(user, OTPTYPE.REGISTRATION_OTP);
      await user.save();

      return {
        ...new GetUserResource(user),
        verificationRequired: true,
        message: "Account reactivated. Please verify OTP to continue.",
      };
    }

    if (user) {
      throw new BadRequestException("Email already in use.");
    }

    user = await CommonService.createOne(User, {
      firstName: data.firstName,
      lastName: data.lastName,
      name: fullName,
      email,
      termCondition: data.termCondition ?? 0,
      providerType: AUTH_PROVIDER.LOCAL,
      providerId: null,
      lastLoginProvider: AUTH_PROVIDER.LOCAL,
      isVerified: false,
    });

    await this.generateAndSendOtp(user, OTPTYPE.REGISTRATION_OTP);

    return {
      ...new GetUserResource(user),
      verificationRequired: true,
    };
  }

  static async verifyOtp(data) {
    const email = data.email.toLowerCase();
    const type = OTP_TYPE_CODE_TO_VALUE[data.type];

    if (!type) {
      throw new BadRequestException("Invalid OTP type.");
    }

    const checkExistOTP = await CommonService.findOne(Otp, {
      email,
      otp: data.otp,
      type,
      isConsumed: false,
    });

    if (!checkExistOTP) {
      throw new BadRequestException("Invalid Otp.");
    }

    if (moment().isAfter(checkExistOTP.expiresAt)) {
      checkExistOTP.isExpired = true;
      await checkExistOTP.save();
      throw new ForbiddenException("Otp expired.");
    }

    const user = await CommonService.findOne(User, { email });
    if (!user) {
      throw new PreconditionFailedException("User not exist with this email address.");
    }

    if (user.isDeleted) {
      throw new ForbiddenException("This account has been deleted.");
    }

    checkExistOTP.isConsumed = true;
    await checkExistOTP.save();

    if (type === OTPTYPE.REGISTRATION_OTP) {
      user.isVerified = true;
      await user.save();

      const authenticate = await this.issueAuthenticationPayload(
        user,
        AUTH_PROVIDER.LOCAL
      );

      return authenticate;
    }

    if (type === OTPTYPE.LOGIN_OTP) {
      if (user.providerType !== AUTH_PROVIDER.LOCAL) {
        throw new ForbiddenException(
          "Login OTP is only available for local sign in users."
        );
      }

      if (!user.isVerified) {
        throw new ForbiddenException(
          "Please verify registration OTP before login OTP verification."
        );
      }

      return this.issueAuthenticationPayload(user, AUTH_PROVIDER.LOCAL);
    }
  }

  static async resendOtp(data) {
    const email = data.email.toLowerCase();
    const type = OTP_TYPE_CODE_TO_VALUE[data.type];

    if (!type) {
      throw new BadRequestException("Invalid OTP type.");
    }

    const user = await CommonService.findOne(User, { email });

    if (!user) {
      throw new PreconditionFailedException(
        "User not exist with this email address."
      );
    }

    if (user.isDeleted) {
      throw new ForbiddenException("This account has been deleted.");
    }

    if (type === OTPTYPE.LOGIN_OTP && user.providerType !== AUTH_PROVIDER.LOCAL) {
      throw new ForbiddenException(
        "Login OTP is only available for local sign in users."
      );
    }

    if (type === OTPTYPE.REGISTRATION_OTP && user.isVerified) {
      throw new ForbiddenException("Already Verified.");
    }

    if (type === OTPTYPE.LOGIN_OTP && !user.isVerified) {
      throw new ForbiddenException(
        "Please verify registration OTP before requesting login OTP."
      );
    }

    await this.generateAndSendOtp(user, type);
    return true;
  }

  static async login(data) {
    const email = data.email.toLowerCase();
    const user = await CommonService.findOne(User, { email });

    if (!user) {
      throw new PreconditionFailedException(
        "User not exist with this email address."
      );
    }

    if (user.isDeleted) {
      throw new ForbiddenException("This account has been deleted.");
    }

    if (user.providerType !== AUTH_PROVIDER.LOCAL) {
      throw new ForbiddenException(
        `This account does not have local login enabled. Use ${user.providerType}.`
      );
    }

    if (!user.isVerified) {
      return {
        ...new GetUserResource(user),
        verificationRequired: true,
      };
    }

    await this.generateAndSendOtp(user, OTPTYPE.LOGIN_OTP);

    return {
      ...new GetUserResource(user),
      verificationRequired: true,
      otpType: OTPTYPE.LOGIN_OTP,
      message: "Login OTP sent successfully. Please verify OTP to continue.",
    };
  }

  static async refreshTokenToGenerateAccessToken(token) {
    const refreshToken = await CommonService.findOne(RefreshToken, {
      token,
      isRevoked: false,
    });

    if (!refreshToken || moment().isAfter(refreshToken.expiresAt)) {
      throw new UnauthorizedException(
        "This refresh token is expired, please login"
      );
    }

    const accessToken = await CommonService.findOne(AccessToken, {
      token: refreshToken.accessToken,
      isRevoked: false,
    });

    if (!accessToken) {
      throw new UnauthorizedException(
        "This refresh token is expired, please login"
      );
    }

    const user = await CommonService.findByPk(User, accessToken.userId);
    if (!user) {
      throw new UnauthorizedException(
        "This refresh token is expired, please login"
      );
    }

    refreshToken.isRevoked = true;
    await refreshToken.save();

    accessToken.isRevoked = true;
    await accessToken.save();

    const authPayload = await this.issueAuthenticationPayload(
      user,
      user.lastLoginProvider || AUTH_PROVIDER.LOCAL
    );

    return authPayload.authenticate;
  }

  static async logOut(data) {
    const accessToken = await CommonService.findOne(AccessToken, {
      token: data.authUser.jti,
      userId: data.authUser.id,
    });

    if (accessToken) {
      accessToken.isRevoked = true;
      await accessToken.save();
    }

    if (data.reqData.refreshToken) {
      const refreshToken = await CommonService.findOne(RefreshToken, {
        token: data.reqData.refreshToken,
        userId: data.authUser.id,
      });

      if (refreshToken) {
        refreshToken.isRevoked = true;
        await refreshToken.save();
      }
    }
  }

  static async updateProfile({ authUser, body }) {
    const user = await CommonService.findByPk(User, authUser.id);

    if (!user) {
      throw new PreconditionFailedException("User not exist with this id.");
    }

    if (user.isDeleted) {
      throw new ForbiddenException("This account has been deleted.");
    }

    if (body.firstName) {
      user.firstName = body.firstName;
    }

    if (body.lastName) {
      user.lastName = body.lastName;
    }

    if (body.timezone) {
      user.timezone = body.timezone;
    }

    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    if (fullName) {
      user.name = fullName;
    }

    if (body.email) {
      if (user.providerType !== AUTH_PROVIDER.LOCAL) {
        throw new ForbiddenException("Profile update is not allowed for this request.");
      }

      const newEmail = body.email.toLowerCase();

      if (newEmail === user.email) {
        throw new BadRequestException(
          "New email address must be different from current email."
        );
      }

      const existingUser = await CommonService.findOne(User, { email: newEmail });
      if (existingUser && existingUser.id !== user.id) {
        throw new BadRequestException("Email already in use.");
      }

      await this.createEmailUpdateRequestAndSendOtp({
        userId: user.id,
        oldEmail: user.email,
        newEmail,
      });
    }

    await user.save();

    return new GetUserResource(user);
  }

  static async resendEmailUpdateOtp({ authUser }) {
    const user = await CommonService.findByPk(User, authUser.id);

    if (!user) {
      throw new PreconditionFailedException("User not exist with this id.");
    }

    if (user.isDeleted) {
      throw new ForbiddenException("This account has been deleted.");
    }

    const latestEmailUpdateRequest = await EmailUpdateRequest.findOne({
      where: {
        userId: user.id,
        isConsumed: false,
      },
      order: [["createdAt", "DESC"]],
    });

    if (!latestEmailUpdateRequest) {
      throw new BadRequestException("No pending email update request found.");
    }

    const existingUser = await CommonService.findOne(User, {
      email: latestEmailUpdateRequest.newEmail,
    });

    if (existingUser && existingUser.id !== user.id) {
      throw new BadRequestException("Email already in use.");
    }

    await this.createEmailUpdateRequestAndSendOtp({
      userId: user.id,
      oldEmail: latestEmailUpdateRequest.oldEmail,
      newEmail: latestEmailUpdateRequest.newEmail,
    });

    return true;
  }

  static async verifyEmailUpdate({ authUser, body }) {
    const user = await CommonService.findByPk(User, authUser.id);

    if (!user) {
      throw new PreconditionFailedException("User not exist with this id.");
    }

    if (user.isDeleted) {
      throw new ForbiddenException("This account has been deleted.");
    }

    const emailUpdateRequest = await CommonService.findOne(EmailUpdateRequest, {
      userId: user.id,
      otp: body.otp,
      isConsumed: false,
      isExpired: false,
    });

    if (!emailUpdateRequest) {
      throw new BadRequestException("Invalid Otp.");
    }

    if (moment().isAfter(emailUpdateRequest.expiresAt)) {
      emailUpdateRequest.isExpired = true;
      await emailUpdateRequest.save();
      throw new ForbiddenException("Otp expired.");
    }

    const existingUser = await CommonService.findOne(User, {
      email: emailUpdateRequest.newEmail,
    });

    if (existingUser && existingUser.id !== user.id) {
      throw new BadRequestException("Email already in use.");
    }

    user.email = emailUpdateRequest.newEmail;
    await user.save();

    emailUpdateRequest.isConsumed = true;
    await emailUpdateRequest.save();

    return new GetUserResource(user);
  }

  static async findOrCreateSocialUser({ provider, profile }) {
    const email = profile?.emails?.[0]?.value?.toLowerCase();

    if (!email) {
      throw new BadRequestException(
        `${provider} login did not return an email address.`
      );
    }

    let user = await CommonService.findOne(User, {
      providerType: provider,
      providerId: profile.id,
    });
    if (user) {
      if (user.isDeleted) {
        throw new ForbiddenException("This account has been deleted.");
      }

      user.lastLoginProvider = provider;
      await user.save();
      return user;
    }

    user = await CommonService.findOne(User, { email });

    if (user) {
      if (user.isDeleted) {
        throw new ForbiddenException("This account has been deleted.");
      }

      if (user.providerType !== provider) {
        throw new BadRequestException(
          `Email already in use with ${user.providerType} sign in.`
        );
      }

      throw new BadRequestException("Email already in use.");
    }

    user = await CommonService.createOne(User, {
      name: profile.displayName,
      email,
      isVerified: true,
      providerType: provider,
      providerId: profile.id,
      lastLoginProvider: provider,
    });

    return user;
  }

  static async issueAuthenticationPayload(user, provider) {
    const freshUser = await CommonService.findByPk(User, user.id);

    if (!freshUser) {
      throw new PreconditionFailedException("User not exist with this id.");
    }

    if (freshUser.isDeleted) {
      throw new ForbiddenException("This account has been deleted.");
    }

    freshUser.lastLoginProvider = provider;
    await freshUser.save();

    const randomString = randomStringGenerator();
    const token = await AuthHelper.tokenGenerator({
      id: freshUser.id,
      jti: randomString,
    });

    await AuthHelper.storeAccessToken(freshUser, randomString);
    const refreshToken = randomStringGenerator();
    await AuthHelper.storeRefreshToken(freshUser, randomString, refreshToken);

    const authenticate = {
      tokenType: "Bearer",
      accessToken: token,
      refreshToken,
      expiresIn: expiresInSeconds,
    };

    return {
      ...new GetUserResource(freshUser),
      authenticate,
    };
  }

  static async generateAndSendOtp(user, type) {
    const generateOTP = await this.resolveOtpForCurrentEnvironment();
    const expiresAt = moment().add(10, "minutes").toDate();

    if (isDevelopmentEnv) {
      authLogger.warn("Using configured OTP for development environment.", {
        email: user.email,
        type,
        otp: generateOTP,
        expiresAt,
      });
    }

    await CommonService.update(
      Otp,
      { isConsumed: true, isExpired: true },
      {
        email: user.email,
        type,
        isConsumed: false,
      }
    );

    await CommonService.createOne(Otp, {
      email: user.email,
      userId: user.id,
      otp: generateOTP,
      type,
      expiresAt,
    });

    if (!isDevelopmentEnv) {
      await sendMail({
        to: user.email,
        subject: `${process.env.APP_NAME} OTP`,
        otp: generateOTP,
        message: `Your OTP for ${type} is ${generateOTP}`,
      });
    } else {
      authLogger.warn("Skipped OTP email in development environment.", {
        email: user.email,
        type,
      });
    }
  }

  static async createEmailUpdateRequestAndSendOtp({
    userId,
    oldEmail,
    newEmail,
  }) {
    await CommonService.update(
      EmailUpdateRequest,
      { isConsumed: true, isExpired: true },
      {
        userId,
        isConsumed: false,
      }
    );

    const otp = await this.resolveOtpForCurrentEnvironment();
    const expiresAt = moment()
      .add(EMAIL_UPDATE.OTP_EXPIRES_IN_MINUTES, "minutes")
      .toDate();

    if (isDevelopmentEnv) {
      authLogger.warn(
        "Using configured email update OTP for development environment.",
        {
        userId,
        oldEmail,
        newEmail,
        otp,
        expiresAt,
        }
      );
    }

    await CommonService.createOne(EmailUpdateRequest, {
      userId,
      oldEmail,
      newEmail,
      otp,
      expiresAt,
    });

    if (!isDevelopmentEnv) {
      await sendMail({
        to: newEmail,
        subject: `${process.env.APP_NAME} OTP`,
        otp,
        message: `Your OTP for email update is ${otp}`,
      });
    } else {
      authLogger.warn("Skipped email update OTP email in development environment.", {
        userId,
        newEmail,
      });
    }
  }

  static async resolveOtpForCurrentEnvironment() {
    if (isDevelopmentEnv) {
      const configuredOtp = `${process.env.DEVELOPMENT_OTP || ""}`.trim();
      if (configuredOtp) {
        return configuredOtp;
      }

      authLogger.warn(
        "DEVELOPMENT_OTP is not configured. Falling back to generated OTP in development."
      );
      return AuthHelper.generateOTP();
    }

    return AuthHelper.generateOTP();
  }

  static async deleteAccount({ authUser }) {
    const user = await CommonService.findByPk(User, authUser.id);

    if (!user) {
      throw new PreconditionFailedException("User not exist with this id.");
    }

    if (user.isDeleted) {
      throw new ForbiddenException("Account already deleted.");
    }

    await CommonService.update(
      AccessToken,
      { isRevoked: true },
      {
        userId: user.id,
        isRevoked: false,
      }
    );

    await CommonService.update(
      RefreshToken,
      { isRevoked: true },
      {
        userId: user.id,
        isRevoked: false,
      }
    );

    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save();

    return true;
  }
}

export default AuthService;
