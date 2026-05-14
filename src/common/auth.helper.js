import moment from "moment";
import jwt from "jsonwebtoken";
import { JWT } from "./constants/constant";
import AccessToken from "../../model/accessToken";
import RefreshToken from "../../model/refreshToken";

class AuthHelper {
  static async tokenGenerator(data) {
    return jwt.sign(data, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN });
  }

  static async getDataFromToken(token) {
    return jwt.verify(token, JWT.SECRET);
  }

  static async storeAccessToken(user, cryptoString) {
    const expiredAt = moment()
      .utc()
      .add(15, "minutes")
      .toDate();

    await AccessToken.create({
      token: cryptoString,
      userId: user.id,
      expiresAt: expiredAt,
    });

    return true;
  }

  static async storeRefreshToken(user, accessTokenId, refreshToken) {
    const expiresAt = moment()
      .utc()
      .add(JWT.REFRESH_EXPIRES_IN_DAYS, "days")
      .toDate();

    await RefreshToken.create({
      token: refreshToken,
      accessToken: accessTokenId,
      userId: user.id,
      expiresAt,
    });

    return true;
  }

  static async generateOTP() {
    const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < 4; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }

    return otp;
  }
}

export default AuthHelper;
