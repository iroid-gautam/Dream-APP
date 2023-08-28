import { baseUrl } from "../../common/constants/constant"


export default class GetUserProfileResource {
    constructor(data, subscribed) {
        return {
            _id: data._id,
            name: data.name,
            email: data.email,
            profileImage: data.profileImage ? baseUrl(data.profileImage) : null,
            isVerified: data.isVerified,
            // isSubscription: subscribed ? true : false
            isSubscribed: subscribed
        }
    }
}