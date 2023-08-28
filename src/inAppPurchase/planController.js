import moment from "moment";
import PlanServices from "./planServices";


class PlanController {
    /**
     * @description: In app purchase
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async purchaseSubscription(req, res) {
        const data = await PlanServices.purchaseSubscription(req.user._id, req.body, req, res);
        return res.send({ data: data });
    }



    /**
     * @description: Get subscription
     * @param {*} req 
     * @param {*} res 
     */
    static async getSubscription(req, res) {
        const isTestEnvironment = req.query.isTestEnvironment;
        const subscription = await PlanServices.getSubscription(
            req.user._id,
            // isTestEnvironment
        );

        if (subscription) {
            const date = new Date(moment(subscription.purchaseDate).add(30, "days"));
            var freeUntill = date.getTime();
        }

        console.log(freeUntill);

        const data = subscription ? {
            expiryDate: moment(subscription.expiryDate).unix(),
            freeUntill,
            isFreeTrialUse: subscription.isFreeTrialUse,
        } : null

        return res.send({ data });
    }




    /**
     * @description: IOS webhook
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async iOSManualSubscriptionWebhook(req, res) {
        await PlanServices.iOSManualSubscriptionWebhook(
            req.body
        );
        return res.send({ message: "success" });
    }



    /**
     * @description: Android webhook
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async androidManualSubscriptionWebhook(req, res) {
        await PlanServices.androidManualSubscriptionWebhook(
            req.body
        );
        return res.send({ message: "success" });
    }
}

export default PlanController;