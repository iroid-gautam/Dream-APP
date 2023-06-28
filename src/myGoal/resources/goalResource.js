import moment from "moment";
import { baseUrl } from "../../common/constants/constant"

export default class GoalResource {
    constructor(data) {
        return ({
            _id: data._id,
            name: data.name,
            type: data.type,
            description: data.description,
            startDate: moment().unix(data.startDate),
            endDate: moment().unix(data.endDate),
            image: data.image ? baseUrl(data.image) : null,
            markDone: data.markDone,
            habits: data.habitsId ? data.habitsId.map(file => ({
                _id: file._id,
                name: file.name
            })) : null
        });
    }
}