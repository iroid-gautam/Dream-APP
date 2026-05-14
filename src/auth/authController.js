import AuthService from "./authService";
import passport from "passport";

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
    return res.send({ data: register });
  }

  static async verifyOtp(req, res) {
    const verifyOtp = await AuthService.verifyOtp(req.body);
    return res.send({ data: verifyOtp });
  }

  static async resendOtp(req, res) {
    await AuthService.resendOtp(req.body);
    return res.send({
      message: "OTP sent to your email. Please check your inbox.",
    });
  }

  static async login(req, res) {
    const login = await AuthService.login(req.body);
    return res.send({ data: login });
  }

  static async refreshTokenToGenerateAccessToken(req, res) {
    const data = await AuthService.refreshTokenToGenerateAccessToken(
      req.body.refreshToken
    );
    return res.send({ data });
  }

  static async logOut(req, res) {
    await AuthService.logOut({
      reqData: req.body,
      authUser: req.user,
    });

    return res.send({ message: "Logged out successfully." });
  }

  static async forgotPassword(req, res) {
    await AuthService.forgotPassword(req.body.email);
    return res.send({
      message: "OTP sent to your email. Please use it to reset password.",
    });
  }

  static async resetPassword(req, res) {
    await AuthService.resetPassword(req.body);
    return res.send({ message: "Password reset successfully." });
  }

  static async changePassword(req, res) {
    await AuthService.changePassword(req.user, req.body);
    return res.send({ message: "Password changed successfully." });
  }

  static async updateProfile(req, res) {
    const result = await AuthService.updateProfile({
      authUser: req.user,
      body: req.body,
    });

    const isEmailUpdateRequested = Boolean(req.body?.newEmail);

    return res.send({
      message: isEmailUpdateRequested
        ? "Profile updated and OTP sent to your new email. Please verify to continue."
        : "Profile updated successfully.",
      data: result,
    });
  }

  static async verifyEmailUpdate(req, res) {
    const user = await AuthService.verifyEmailUpdate({
      authUser: req.user,
      body: req.body,
    });

    return res.send({
      message: "Email updated successfully.",
      data: user,
    });
  }

  static async resendEmailUpdateOtp(req, res) {
    await AuthService.resendEmailUpdateOtp({
      authUser: req.user,
    });

    return res.send({
      message: "OTP sent to your new email. Please verify to continue.",
    });
  }

  static async deleteAccount(req, res) {
    await AuthService.deleteAccount({
      authUser: req.user,
    });

    return res.send({
      message: "Account deleted successfully.",
    });
  }

  static async oauthCallback(req, res) {
    const provider = req.params.provider || req.user.oauthProvider;
    const data = await AuthService.issueAuthenticationPayload(
      req.user,
      provider
    );

    return res.send({ data });
  }

  static async me(req, res) {
    return res.send({ data: req.user });
  }
}

export default AuthController;
