import moment from "moment";

export default class SingleHabitResource {
    constructor(data) {
        return ({
            _id: data._id,
            name: data.name,
            frequency: data.frequency,
            description: data.description,
            startDate: moment().unix(data.startDate),
            markDone: data.markDone,
            goal: data.goalId ? data.goalId.name : null,
        });
    }
}