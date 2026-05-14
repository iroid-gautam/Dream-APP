import dotenv from "dotenv";
dotenv.config();

module.exports = {
  baseUrl(path = null) {
    let url = `${process.env.BASE_URL}:${process.env.PORT}`;
    if (process.env.IS_SECURE === "true" && process.env.HOST) {
      url = `https://${process.env.HOST}`;
    }

    return url + (path ? `/${path}` : "");
  },

  apiBaseUrl(path = null) {
    let url = `${process.env.BASE_URL}:${process.env.PORT}/api/v1`;
    if (process.env.IS_SECURE === "true" && process.env.HOST) {
      url = `https://${process.env.HOST}/api/v1`;
    }

    return url + (path ? `/${path}` : "");
  },

  BCRYPT: {
    SALT_ROUND: 12,
  },

  JWT: {
    SECRET: process.env.JWT_SECRET || "oauth-service-secret",
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",
    REFRESH_EXPIRES_IN_DAYS: Number(process.env.REFRESH_EXPIRES_IN_DAYS || 30),
  },

  EMAIL_UPDATE: {
    OTP_EXPIRES_IN_MINUTES: Number(
      process.env.EMAIL_UPDATE_OTP_EXPIRES_IN_MINUTES || 10
    ),
  },

  OTPTYPE: {
    REGISTRATION_OTP: "registration",
    FORGOT_PASSWORD: "forgot_password",
    LOGIN_OTP: "login",
  },

  OTP_TYPE_CODE: {
    REGISTRATION: 1,
    LOGIN: 2,
    FORGOT_PASSWORD: 3,
  },

  OTP_TYPE_CODE_TO_VALUE: {
    1: "registration",
    2: "login",
    3: "forgot_password",
  },

  AUTH_PROVIDER: {
    LOCAL: "local",
    GOOGLE: "google",
    FACEBOOK: "facebook",
  },
};
