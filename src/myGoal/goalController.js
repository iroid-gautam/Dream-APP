import SearchHabitGoalResource from "../myHabits/resources/searchResources";
import GoalServices from "./goalServices";


class GoalController {
    /**
     * @description: Add goal
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async addGoal(req, res) {
        const data = await GoalServices.addGoal(req.user._id, req.file, req.body, req, res);
        return res.send({ message: "You have successfully added this goal", data })
    }



    /**
     * @description: Get single goal
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async getSingleGoal(req, res) {
        const data = await GoalServices.getSingleGoal(req.params.id, req, res);
        return res.send({ data: data })
    }



    /**
     * @description: mark as done this goal
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async markAsDoneGoal(req, res) {
        const data = await GoalServices.markAsDoneGoal(req.params.id, req, res);
        return res.send({ message: "Congrats! You have achieved this goal." })
    }



    /**
     * @description: Delete goal
     * @param {*} req 
     * @param {*} res 
     */
    static async deleteGoal(req, res) {
        const data = await GoalServices.deleteGoal(req.params.id, req, res);
        return res.send({ message: "You have successfully deleted this goal." })
    }



    /**
     * @description: Search goal
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async searchGoal(req, res) {
        const { data, meta } = await GoalServices.searchGoal(req.user._id, req.query, req.body, req, res);
        return res.send({ data: new SearchHabitGoalResource(data), meta: meta })
    }
}

export default GoalController;