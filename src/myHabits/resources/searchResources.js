export default class SearchHabitGoalResource {
    constructor(habit) {
        return habit.map(data => ({
            _id: data._id,
            name: data.name,
        }));
    }
}