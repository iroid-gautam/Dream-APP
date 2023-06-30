import moment from "moment";
import { baseUrl } from "../../common/constants/constant";

export default class GoalProgressCompleteListingResource {
    constructor(process, goal) {
        return ({
            totalGoal: process.progress,
            completedGoal: process.complete,
            goals: goal.length > 0 ? goal.map((data) => ({
                _id: data._id,
                name: data.name,
                image: data.image != null ? baseUrl(data.image) : null
            })) : null
        });
    }
}