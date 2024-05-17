import AuthService from "./authService";
import GetUserResource from "./resources/getUserResource";
const expiresInSeconds = 31536000;


class AuthController {
  /**
   * User Registration
   * @param {*} req
   * @param {*} res
   */

  static async register(req, res) {
    const data = [];
    data.reqData = req.body;
    data.file = req.file;
    const register = await AuthService.register(data);

    return res.send({ data: register });
  }

  /**
   * Verify OTP
   * @param {*} req
   * @param {*} res
   */
  static async verifyOtp(req, res) {
    const data = [];
    data.reqData = req.body;

    const verifyOtp = await AuthService.verifyOtp(data);

    return res.send({ data: verifyOtp });
  }

  /**
   * Resend Otp
   * @param {*} req
   * @param {*} res
   */
  static async resendOtp(req, res) {
    const data = req.body;

    const resendOtp = await AuthService.resendOtp(data);

    return res.send({
      message: "OTP sent to your email. Please check your inbox.",
    });
  }

  /**
   * login user
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  static async login(req, res) {
    const data = req.body;

    const login = await AuthService.login(data);

    return res.send({
      data: login
      // ... new GetUserResource(login),
      // data: {
      //   auth: {
      //     tokenType: "Bearer",
      //     accessToken: login.token,
      //     refreshToken: null,
      //     expiresIn: expiresInSeconds,
      //   },
      // },
    });

  }


  /**
     * @description: Refress token to generate access token
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
  static async refreshTokenToGenerateAccessToken(req, res) {
    const data = await AuthService.refreshTokenToGenerateAccessToken(req.body.refreshToken);
    return res.send({ data: data });
  }


  /**
   * log out user 
   * @param {*} req 
   * @param {*} res 
   */
  static async logOut(req, res) {
    const data = {
      reqData: req.body,
      authUser: req.user
    };

    await AuthService.logOut(data);

    res.send({ message: "Logged out successfully." });
  }

  /**
   * reset password
   * @param {*} req 
   * @param {*} res 
   */
  static async resetPassword(req, res) {
    await AuthService.resetPassword(req.body.email);

    return res.send({ message: "Please check your email for instructions to reset your password." });
  }


  /**
     * @description : check version
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns 
     */
  static async checkVersion(req, res, next) {
    const message = await AuthService.checkVersion(req.body);
    return res.send(message)
  }
}

export default AuthController;
