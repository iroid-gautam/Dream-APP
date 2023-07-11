import moment from "moment";

export default class SingleHabitResource {
    constructor(data) {
        return ({
            _id: data._id,
            name: data.name,
            frequency: data.frequency,
            days: data.days,
            description: data.description,
            startDate: moment(data.startDate).unix(),
            markDone: data.markDone,
            goal: data.goalId ? data.goalId.name : null,
        });
    }
}