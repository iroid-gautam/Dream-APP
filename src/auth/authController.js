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
    return CustomHelper.success(res, "Registered successfully.", register);
  }

  static async verifyOtp(req, res) {
    const verifyOtp = await AuthService.verifyOtp(req.body);
    return CustomHelper.success(res, "OTP verified successfully.", verifyOtp);
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
    return CustomHelper.success(res, "Login successful.", login);
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

    return CustomHelper.success(res, "Logged out successfully.");
  }

  static async updateProfile(req, res) {
    const result = await AuthService.updateProfile({
      authUser: req.user,
      body: req.body,
    });

    const isEmailUpdateRequested = Boolean(req.body?.email);

    return CustomHelper.success(
      res,
      isEmailUpdateRequested
        ? "Profile updated and OTP sent to your new email. Please verify to continue."
        : "Profile updated successfully.",
      result
    );
  }

  static async verifyEmailUpdate(req, res) {
    const user = await AuthService.verifyEmailUpdate({
      authUser: req.user,
      body: req.body,
    });

    return CustomHelper.success(res, "Email updated successfully.", user);
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

    return CustomHelper.success(res, "Account deleted successfully.");
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
