import moment from "moment";
import { baseUrl } from "../../common/constants/constant"
export default class JournalListingResource {
    constructor(journal) {
        return journal.map(data => ({
            _id: data._id,
            description: data.description,
            image: data.image !== null ? baseUrl(data.image) : null,
            createdDate: moment(data.createdAt).unix()
        }));
    }
}