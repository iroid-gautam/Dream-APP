import moment from "moment";

export default class HabitListingResource {
    constructor(progress, habit) {
        return ({
            daily: progress.h0,
            dailyCompleted: progress.h0Done,
            weekly: progress.h1,
            weeklyCompleted: progress.h1Done,
            monthly: progress.h2,
            monthlyCompleted: progress.h2Done,
            habits: habit.map((file) => ({
                _id: file._id,
                name: file.name,
                frequency: file.frequency,
                markDone: file.markDone
            }))
        });
    }
}