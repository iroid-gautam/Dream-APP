import moment from "moment";
import { baseUrl } from "../../common/constants/constant";

export default class AllCardsListingResource {
    constructor(data, flip) {
        // return videopodcast.map(data => ({
        //     _id: data._id,
        //     type: data.type,
        //     frontImage: data.frontImage !== null ? baseUrl(data.frontImage) : null,
        //     flipImage: data.flipImage !== null ? baseUrl(data.flipImage) : null,
        //     // uploadOn: moment(data.createdAt).unix()
        // }));


        return ({
            _id: data[0]._id,
            type: data[0].type,
            visible: flip !== null ? true : false,
            frontImage: data[0].frontImage !== null ? baseUrl(data[0].frontImage) : null,
            flipImage: data[0].flipImage !== null ? baseUrl(data[0].flipImage) : null,
        })
    }
}