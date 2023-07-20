import admin from "firebase-admin";
import fcmConfig from "./config/fcmConfig";

import { BadRequestException } from "../../src/common/error-exceptions";

class FcmHelper {
  /**
   * @description: Send push notification
   * @param {*} tokens
   * @param {*} payload 
   */
  static async sendPushNotification(tokens, payload) {
    try {
      // const payload = {
      //     notification: {
      //         title: payload.notification.title,
      //         body: payload.notification.body,
      //     },
      //     token: token
      // };
      // fcmConfig
      //     .messaging()
      //     .send(payload)
      //     .then((res) => {
      //         console.log("success");
      //     })
      //     .catch((err) => {
      //         console.log("error", err);
      //     });

      if (tokens.length > 0) {
        const messaging = admin.messaging();
        const fcmMessages = [];

        tokens.map((token) => {
          fcmMessages.push({
            token: token,
            apns: {
              payload: {
                aps: {
                  alert: payload.notification,
                },
              },
            },
            data: payload.data,
            notification: payload.notification,
          });
        });

        messaging.sendAll(fcmMessages).then((result) => {
          console.log(result.responses);
        });
      }
    } catch (err) {
      throw new BadRequestException(err)
    }
  }
}


export default FcmHelper;