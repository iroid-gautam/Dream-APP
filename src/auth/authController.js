import AuthService from "./authService";
import passport from "passport";
import CustomHelper from "../common/helpers/customHelper";

class AuthController {
  static socialAuthStart(req, res, next) {
    const providerConfig = AuthService.getSocialProviderConfig(
      req.params.provider
    );

    return passport.authenticate(providerConfig.strategy, {
      ...providerConfig.authOptions,
      session: false,
    })(req, res, next);
  }

  static socialAuthCallback(req, res, next) {
    const providerConfig = AuthService.getSocialProviderConfig(
      req.params.provider
    );

    return passport.authenticate(providerConfig.strategy, {
      session: false,
    })(req, res, next);
  }

  static async register(req, res) {
    const register = await AuthService.register(req.body);
    const data = {
      id: register.id,
      firstName: register.firstName || null,
      lastName: register.lastName || null,
      email: register.email,
    };

    return CustomHelper.success(res, "Request processed successfully.", data);
  }

  static async verifyOtp(req, res) {
    const verifyOtp = await AuthService.verifyOtp(req.body);
    const data = {
      tokenType: verifyOtp?.authenticate?.tokenType,
      accessToken: verifyOtp?.authenticate?.accessToken,
      refreshToken: verifyOtp?.authenticate?.refreshToken,
      expiresIn: verifyOtp?.authenticate?.expiresIn,
    };

    return CustomHelper.success(res, "Authentication successful.", data);
  }

  static async resendOtp(req, res) {
    await AuthService.resendOtp(req.body);
    return CustomHelper.success(
      res,
      "OTP sent to your email. Please check your inbox."
    );
  }

  static async login(req, res) {
    const login = await AuthService.login(req.body);
    const data = {
      id: login.id,
      firstName: login.firstName || null,
      lastName: login.lastName || null,
      email: login.email,
    };

    return CustomHelper.success(res, "Request processed successfully.", data);
  }

  static async refreshTokenToGenerateAccessToken(req, res) {
    const data = await AuthService.refreshTokenToGenerateAccessToken(
      req.body.refreshToken
    );
    return CustomHelper.success(res, "Access token generated successfully.", data);
  }

  static async logOut(req, res) {
    await AuthService.logOut({
      reqData: req.body,
      authUser: req.user,
    });

    return CustomHelper.success(res, "User logout successfully.");
  }

  static async updateProfile(req, res) {
    const result = await AuthService.updateProfile({
      authUser: req.user,
      body: req.body,
    });

    const data = {
      id: result.id,
      firstName: result.firstName || null,
      lastName: result.lastName || null,
      email: result.email,
    };

    return CustomHelper.success(res, "User updated successfully.", data);
  }

  static async verifyEmailUpdate(req, res) {
    const user = await AuthService.verifyEmailUpdate({
      authUser: req.user,
      body: req.body,
    });

    const data = {
      email: user.email,
    };

    return CustomHelper.success(res, "User updated successfully.", data);
  }

  static async resendEmailUpdateOtp(req, res) {
    await AuthService.resendEmailUpdateOtp({
      authUser: req.user,
    });

    return CustomHelper.success(
      res,
      "OTP sent to your new email. Please verify to continue."
    );
  }

  static async deleteAccount(req, res) {
    await AuthService.deleteAccount({
      authUser: req.user,
    });

    return CustomHelper.success(res, "User deleted successfully.");
  }

  static async oauthCallback(req, res) {
    const provider = req.params.provider || req.user.oauthProvider;
    const data = await AuthService.issueAuthenticationPayload(
      req.user,
      provider
    );

    return CustomHelper.success(res, "Authentication successful.", data);
  }

  static async me(req, res) {
    return CustomHelper.success(res, "User profile fetched successfully.", req.user);
  }
}

export default AuthController;
