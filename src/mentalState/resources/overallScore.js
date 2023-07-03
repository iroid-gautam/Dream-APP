
export default class OverAllScoreResource {
    constructor(data) {
        return ({
            lastWeekAvg: data.lastWeek,
            currentWeekAvg: data.current
        });
    }
}