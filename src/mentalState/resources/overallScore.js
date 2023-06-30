
export default class OverAllScoreResource {
    constructor(data) {
        return ({
            lastWeekAvg: data.current,
            currentWeekAvg: data.lastWeek
        });
    }
}