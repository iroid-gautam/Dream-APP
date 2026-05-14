import { getFirebaseMessaging } from "../config/firebase";
import logger from "../logger";

const pushLogger = logger.withLabel("PUSH_NOTIFICATION");

class PushNotificationService {
  static async sendMulticast({ tokens, notification, data = {} }) {
    const normalizedTokens = Array.from(
      new Set((tokens || []).map((token) => (token ? token.trim() : "")).filter(Boolean))
    );

    if (!normalizedTokens.length) {
      return {
        successCount: 0,
        failureCount: 0,
        invalidTokens: [],
      };
    }

    const messaging = getFirebaseMessaging();

    const response = await messaging.sendEachForMulticast({
      tokens: normalizedTokens,
      notification,
      data,
    });

    const invalidTokens = [];

    response.responses.forEach((item, index) => {
      if (item.success) {
        return;
      }

      const errorCode = item.error?.code || "";
      const shouldInvalidate =
        errorCode === "messaging/invalid-registration-token" ||
        errorCode === "messaging/registration-token-not-registered";

      if (shouldInvalidate) {
        invalidTokens.push(normalizedTokens[index]);
      }
    });

    pushLogger.info("FCM multicast send completed.", {
      tokenCount: normalizedTokens.length,
      successCount: response.successCount,
      failureCount: response.failureCount,
      invalidTokenCount: invalidTokens.length,
    });

    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
      invalidTokens,
    };
  }
}

export default PushNotificationService;
