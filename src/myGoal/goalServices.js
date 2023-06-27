import MyGoal from "../../model/myGoal";
import commonService from "../../utils/commonServices";

class GoalServices {
    static async addGoal(auth, data, req, res) {
        const { name, type, description, startDate, endDate, habitsId } = data;
        // console.log(auth);
        // console.log("data", data);
        // console.log("habits :- ", data.habitsId.split(','));
        // console.log("habits :- ", habitsId.split(','));

        const insertGoal = await commonService.createOne(MyGoal, {
            userId: auth,
            name: name,
            type: type,
            description: description,
            startDate: startDate,
            endDate: endDate,
            habitsId: habitsId.split(',')
        })
    }
}

export default GoalServices;