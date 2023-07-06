import moment from "moment";
import { baseUrl } from "../../common/constants/constant";

export default class InsightsListingResource {
    constructor(insights) {
        return insights.map(data => ({
            _id: data._id,
            title: data.title,
            description: data.description,
            image: data !== null ? baseUrl(data.image) : null,
            uploadOn: moment(data.createdAt).unix()
        }));
    }
}