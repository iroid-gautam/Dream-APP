import moment from "moment";

export default class JournalListingResource {
    constructor(journal) {
        return journal.map(data => ({
            _id: data._id,
            description: data.description,
            createdDate: moment(data.createdAt).unix()
        }));
    }
}