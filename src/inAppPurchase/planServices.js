import UserSubscription from "../../model/userSubscription";
import { BadRequestException } from "../common/error-exceptions";
import InAppPurchase from "../inAppPurchaseReceipt/verify-receipt";
import moment from "moment";

class PlanServices {
    /**
     * @description: Purchase subscription
     * @param {*} auth 
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     */
    static async purchaseSubscription(auth, data, req, res) {
        const { packageName, productId, purchaseToken, platform, isTestEnvironment } = data

        const iap = await InAppPurchase.verifyInAppReceipt(data, isTestEnvironment);

        const findSubscription = await UserSubscription.findOne({ originalTransactionId: iap.originalTransactionId, purchasePlatform: "iOS" });

        if (findSubscription) {
            throw new BadRequestException("This user already purchase subscription")
        } else {
            const checkUserIsSubscribe = await UserSubscription.findOne({ userId: auth, cancelledAt: null });

            if (!checkUserIsSubscribe) {
                let isFreeTrialUse = false;
                if (platform == "Android") {
                    if (iap.paymentState === 2) {
                        isFreeTrialUse = true;
                    }
                } else if (platform == "iOS") {
                    if (iap.isTrial == true) {
                        isFreeTrialUse = true;
                    }
                }

                await UserSubscription.create({
                    userId: auth,
                    orderId: iap.order,
                    originalTransactionId: iap.originalTransactionId
                        ? iap.originalTransactionId
                        : null,
                    purchaseToken: purchaseToken,
                    purchaseDate: moment
                        .unix(iap.startTimeMillis / 1000)
                        .utc()
                        .format("YYYY-MM-DD HH:mm:ss"),
                    purchasePlatform: platform,
                    autoRenewing: iap.autoRenewing,
                    expiryDate: moment
                        .unix(iap.expiryTimeMillis / 1000)
                        .utc()
                        .format("YYYY-MM-DD HH:mm:ss"),
                    receipt: iap,
                    isFreeTrialUse
                });
            } else {
                let isFreeTrialUse = undefined;
                if (data.platform == "Android") {
                    if (iap.paymentState === 2) {
                        isFreeTrialUse = true;
                    }
                } else if (data.platform == "iOS") {
                    if (iap.isTrial == true) {
                        isFreeTrialUse = true;
                    }
                }

                await UserSubscription.updateOne({ userId: auth }, {
                    orderId: iap.order,
                    originalTransactionId: iap.originalTransactionId
                        ? iap.originalTransactionId
                        : null,
                    purchaseToken: purchaseToken,
                    purchaseDate: moment
                        .unix(iap.startTimeMillis / 1000)
                        .utc()
                        .format("YYYY-MM-DD HH:mm:ss"),
                    purchasePlatform: platform,
                    autoRenewing: iap.autoRenewing,
                    expiryDate: moment
                        .unix(iap.expiryTimeMillis / 1000)
                        .utc()
                        .format("YYYY-MM-DD HH:mm:ss"),
                    receipt: iap,
                    isFreeTrialUse
                })

            }
        }
    }




    /**
     * @description: Find subscription
     * @param {*} auth 
     * @param {*} isTestEnvironment 
     * @returns 
     */
    static async getSubscription(auth, isTestEnvironment) {
        // console.log(auth, isTestEnvironment);
        const findSubscription = await UserSubscription.findOne({ userId: auth });
        return findSubscription;
    }




    /**
     * @description: IOS webhook
     * @param {*} purchasedSubscription 
     * @returns 
     */
    static async iOSManualSubscriptionWebhook(purchasedSubscription) {
        console.log("IOS Webhook", purchasedSubscription);

        if (purchasedSubscription) {
            const data = purchasedSubscription.unified_receipt.latest_receipt_info[0];
            console.log("data", data);
            if (data) {
                await UserSubscription.updateOne({ originalTransactionId: data.originalTransactionId }, {
                    expiryDate: data.expiryDate,
                });
            }
        }
        return;
    }




    /**
     * @description: Android webhook
     * @param {*} purchasedSubscription 
     * @returns 
     */
    static async androidManualSubscriptionWebhook(purchasedSubscription) {
        console.log("Android webhook", purchasedSubscription);

        var token = purchasedSubscription.message.data;
        var base64Payload = token;
        var payloadBuffer = Buffer.from(base64Payload, "base64");
        const inAppReceipt = JSON.parse(payloadBuffer.toString());

        console.log("inAppReceipt", inAppReceipt);

        if (
            inAppReceipt.subscriptionNotification.notificationType == 3 ||
            inAppReceipt.subscriptionNotification.notificationType == 2 ||
            inAppReceipt.subscriptionNotification.notificationType == 12
        ) {

            const data = {
                packageName: inAppReceipt.packageName,
                productId: inAppReceipt.subscriptionNotification.subscriptionId,
                purchaseToken: inAppReceipt.subscriptionNotification.purchaseToken,
                platform: "Android",
            };

            const receiptPayload = await InAppPurchase.verifyInAppReceipt(
                data,
                false
            );

            console.log("receiptPayload", receiptPayload);

            await UserSubscription.updateOne({ purchaseToken: receiptPayload.purchaseToken }, {
                expiryDate: moment
                    .unix(receiptPayload.expiryTimeMillis / 1000)
                    .utc()
                    .format("YYYY-MM-DD HH:mm:ss"),
            });

        }
        return;
    }
}

export default PlanServices;