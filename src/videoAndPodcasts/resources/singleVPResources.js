import moment from "moment";
import { baseUrl } from "../../common/constants/constant";

export default class SingleVPResource {
    constructor(data) {
        return ({
            _id: data._id,
            title: data.title,
            description: data.description,
            videoPodcast: data.videoPodcast !== null ? baseUrl(data.videoPodcast) : null,
            uploadOn: moment(data.createdAt).unix()
        });
    }
}