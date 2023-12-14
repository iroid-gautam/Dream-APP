import moment from "moment"
import { baseUrl } from "../../common/constants/constant"


export default class GetUserProfileResource {
    constructor(data, subscribed, subscription) {
        return {
            _id: data._id,
            name: data.name,
            email: data.email,
            profileImage: data.profileImage ? baseUrl(data.profileImage) : null,
            isVerified: data.isVerified,
            // isSubscription: subscribed ? true : false
            isFreeTrialUse: subscription ? subscription.isFreeTrialUse : false,
            expiryDate: subscription ? moment(subscription.expiryDate).unix() : null,
            isSubscribed: subscribed
        }
    }
}