import iap from "in-app-purchase";
import googleService from "../../unlimited-now-app-8ebd558a175b.json";

// require("dotenv").config();

class VerifyReceipt {

    static async verifyInAppReceipt(receipt, isTestEnvironment) {

        const array = ["true", true];

        iap.config({
            /* Configurations for Apple */
            appleExcludeOldTransactions: true, // if you want to exclude old transaction, set this to true. Default is false
            applePassword: process.env.APPLE_INAPP_PASSWORD, // this comes from iTunes Connect (You need this to valiate subscriptions)

            /* Configurations for Google Service Account validation: You can validate with just packageName, productId, and purchaseToken */
            googleServiceAccount: {
                clientEmail: googleService.client_email,
                privateKey: googleService.private_key,
            },

            test: array.includes(isTestEnvironment),
        });

        try {
            await iap.setup().catch((err) => {
                console.log(err);
            });

            receipt.subscription = true;
            if (receipt.platform === "Android") {
                const validatedData = await iap.validate(receipt).catch((err) => {
                    console.log("err", err);
                });

                return validatedData;
            } else {
                const validatedData = await iap.validate(receipt.purchaseToken)
                    .catch((err) => {
                        console.log(err);
                    });
                const purchaseData = iap.getPurchaseData(validatedData);

                // if (iap.isExpired(purchaseData[0])) {
                //   throw new Error("Receipt is expired");
                // }
                purchaseData[0].originalTransactionId = purchaseData[0].originalTransactionId;
                purchaseData[0].orderId = purchaseData[0].transactionId;
                purchaseData[0].startTimeMillis = purchaseData[0].purchaseDateMs;
                purchaseData[0].autoRenewing = validatedData.pending_renewal_info[0].auto_renew_status;
                purchaseData[0].expiryTimeMillis = purchaseData[0].expiresDateMs;

                return purchaseData[0];
            }
        } catch (err) {
            console.log(err);
            // throw new Error(err)
            throw new Error("Error while validating receipt");
        }

    }
}

export default VerifyReceipt;