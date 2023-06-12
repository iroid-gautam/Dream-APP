import moment from "moment";
import jwt from "jsonwebtoken";
import { JWT } from "./constants/constant";
import AccessToken from "../../model/accessToken";
import commonService from "../../utils/commonServices";
require("dotenv").config();
const Hours = 8760;


class AuthHelper {

  /**
   * JWT token generator
   * @param {*} data
   * @returns
   */
  static async tokenGenerator(data) {
    return await jwt.sign(data, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN });
  }

  /**
   * Get data from jwt token
   * @param {*} token
   * @returns
   */
  static async getDataFromToken(token) {
    return jwt.verify(token, JWT.SECRET);
  }

  /**
   * Store access token to database
   *
   * @param Object user
   * @param String cryptoString
   * @return Response
   */
  static async storeAccessToken(user, cryptoString) {

    const expiredAt = moment(new Date())
      .utc()
      .add(Hours, "hours")
      .format("YYYY-MM-DD hh:mm:ss");

    const insertData =  {
        token: cryptoString,
        userId: user.id,
        expires_at: expiredAt,
    }

    await commonService.createOne(AccessToken, insertData);

    return true;
  }

  /**
   * generate otp
   * @returns 
   */
  static async generateOTP() {
      const digits = '0123456789';
      let OTP = '';
      for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
      }
      return OTP;
  }
}

export default AuthHelper;

