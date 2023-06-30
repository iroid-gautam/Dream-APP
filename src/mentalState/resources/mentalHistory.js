import moment from "moment";

export default class MentalStateHistoryResource {
    constructor(data) {
        return ({
            history: data.dates,
            currentWeek: data.current,
            peekDay: data.peekDay ? moment(data.peekDay.createdAt).unix() : null,
            downDay: data.downDay ? moment(data.downDay.createdAt).unix() : null
        });
    }
}