import moment from "moment";
import { baseUrl } from "../../common/constants/constant";

export default class InspirationalResource {
    constructor(videopodcast) {
        return videopodcast.map(data => ({
            _id: data._id,
            type: data.type,
            frontImage: data.frontImage !== null ? baseUrl(data.frontImage) : null,
            flipImage: data.flipImage !== null ? baseUrl(data.flipImage) : null,
            // uploadOn: moment(data.createdAt).unix()
        }));
    }
}