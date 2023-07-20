/**
 * configConstant.js
 * @description :: constants used in configuration
 */

import dotenv from "dotenv";
dotenv.config();

module.exports = {

    baseUrl(path = null) {
        let url = `${process.env.BASE_URL}:${process.env.PORT}`;
        if (process.env.isSSLEnable === 'true') {
            url = `https://${process.env.HOST}`;
        }
        return url + (path ? `/${path}` : '');
    },

    apiBaseUrl(path = null) {
        let url = `${process.env.BASE_URL}:${process.env.PORT}/api/v1`;
        if (process.env.isSSLEnable === 'true') {
            url = `${process.env.BASE_URL}/api/v1`;
        }
        return url + (path ? `/${path}` : '');
    },

    BCRYPT: {
        SALT_ROUND: 12,
    },

    JWT: {
        SECRET: "kickfearinthebuttapp",
        EXPIRES_IN: "1 YEAR",
    },

    OTPTYPE: {
        REGISTRATION_OTP: 1,
        FORGOT_PASSWORD: 2
    },

    PLATFORM: {
        ANDROID: "Android",
        IOS: "iOS",
    },

    HABITTYPE: {
        DAILY: 0,
        WEEKLY: 1,
        MONTHLY: 2
    }
};