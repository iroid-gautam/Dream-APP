import User from "../../model/user";
import commonService from "../../utils/commonServices";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  PreconditionFailedException,
  UnprocesssableEntityException,
} from "../../src/common/error-exceptions";
import { OTPTYPE } from "../common/constants/constant";
import Otp from "../../model/otp";
import AuthHelper from "../common/auth.helper";
import sendMail from "../common/middlewares/send-mail.middleware";
import { randomStringGenerator } from "../common/helper";
import moment from "moment";
import AccessToken from "../../model/accessToken";
import FcmToken from "../../model/fcmToken";

class AuthService {
  /**
   * Register data
   * @param {*} data
   * @returns
   */
  static async register(data) {
    const findUser = await commonService.findOne(User, { email: data.email });

    if (findUser) {
      throw new BadRequestException("Email already in use.");
    }

    if (data.file) {
      data.reqData.profileImage =
        data.file.destination + "/" + data.file.filename;
    }

    const registerUser = await commonService.createOne(User, data.reqData);

    if (registerUser) {
      const generateOTP = await AuthHelper.generateOTP();

      const obj = {
        to: registerUser.email,
        subject: `Welcome To ${process.env.APP_NAME}`,
        otp: generateOTP,
        type: OTPTYPE.REGISTRATION_OTP,
      };

      const send = await sendMail(obj, "otp-mail");
      if (send) {
        await commonService.createOne(Otp, {
          email: registerUser.email,
          otp: generateOTP,
          type: OTPTYPE.REGISTRATION_OTP,
        });
      }

      return registerUser;
    }
  }

  /**
   * Verify Otp
   * @param {*} data
   */
  static async verifyOtp(data) {
    const checkExistOTP = await commonService.findOne(Otp, {
      email: data.reqData.email,
      otp: data.reqData.otp,
      type: data.reqData.type,
    });
    let registerUser;

    if (!checkExistOTP) {
      throw new NotFoundException("Invalid Otp.");
    }

    const pastDate = moment(checkExistOTP.created_at, "YYYY-MM-DD HH:mm:ss");
    const presentDate = moment(); // Current date and time
    const duration = moment.duration(presentDate.diff(pastDate));
    const diffInMinutes = duration.asMinutes();

    if (diffInMinutes > 1) {
      await commonService.updateOne(
        Otp,
        { _id: checkExistOTP._id },
        { isExpired: 1 }
      );
      throw new ForbiddenException("Otp expired.");
    } else {
      registerUser = await commonService.findOne(User, {
        email: data.reqData.email,
      });
      if (OTPTYPE.REGISTRATION_OTP == data.reqData.type) {
        const isVerified = await commonService.updateOne(
          User,
          { _id: registerUser.id },
          { isVerified: 1 }
        );

        if (isVerified) {
          const randomString = randomStringGenerator();

          const token = await AuthHelper.tokenGenerator({
            id: registerUser.id,
            jti: randomString,
          });

          await AuthHelper.storeAccessToken(registerUser, randomString);
          registerUser.token = token;
          return registerUser;
        }
      } else if (OTPTYPE.FORGOT_PASSWORD == data.reqData.type) {
        const isForgotPasswordVerified = await commonService.updateOne(
          User,
          { _id: registerUser.id },
          { isForgotPasswordVerified: 1 }
        );

        return "OTP verified successfully.";
      }
    }
  }

  /**
   * Resend OTP data
   * @param {*} data
   * @returns
   */
  static async resendOtp(data) {
    const checkExistEmail = await commonService.findOne(User, {
      email: data.email,
    });

    if (!checkExistEmail) {
      throw new PreconditionFailedException(
        "User not exist with this email address."
      );
    } else if (
      checkExistEmail.isVerified == true &&
      data.type != OTPTYPE.FORGOT_PASSWORD
    ) {
      throw new ForbiddenException("Already Verified.");
    }
    const generateOTP = await AuthHelper.generateOTP();

    if (data.type == OTPTYPE.FORGOT_PASSWORD) {
      await commonService.updateOne(
        User,
        { _id: checkExistEmail._id },
        { isForgotPasswordVerified: false }
      );
    }
    const obj = {
      to: data.email,
      subject: `Welcome To ${process.env.APP_NAME}`,
      otp: generateOTP,
      type: data.type,
    };

    const send = await sendMail(obj, "otp-mail");

    let otp;
    if (send) {
      otp = await commonService.createOne(Otp, {
        email: data.email,
        otp: generateOTP,
        type: data.type,
      });
    }

    return otp;
  }

  /**
   * login user data
   * @param {*} data
   */
  static async login(data) {
    const checkExistEmail = await commonService.findOne(User, {
      email: data.email,
    });

    if (!checkExistEmail) {
      throw new PreconditionFailedException(
        "User not exist with this email address."
      );
    } else if (checkExistEmail.isVerified != true) {
      throw new UnprocesssableEntityException("User not verified yet.");
    }

    const checkPassword = checkExistEmail.isPasswordMatch(data.password);

    if (!checkPassword) {
      throw new BadRequestException("Invalid Credentials!");
    }

    const randomString = randomStringGenerator();

    const token = await AuthHelper.tokenGenerator({
      id: checkExistEmail._id,
      jti: randomString,
    });

    await AuthHelper.storeAccessToken(checkExistEmail, randomString);
    checkExistEmail.token = token;
    return checkExistEmail;
  }

  /**
   * logout use data
   * @param {*} data 
   */
  static async logOut(data) {

    await commonService.updateOne(AccessToken, { token: data.authUser.jti }, { isRevoked: true });

    if (data.reqData.deviceId) {
      await commonService.deleteOne(FcmToken, { deviceId : data.reqData.deviceId });
    }

    return;
  }
}

export default AuthService;
