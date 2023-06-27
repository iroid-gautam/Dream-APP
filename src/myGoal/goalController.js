import GoalServices from "./goalServices";


class GoalController {
    /**
     * @description: Add goal
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async addGoal(req, res) {
        const data = await GoalServices.addGoal(req.user._id, req.body, req, res);
        return res.send({ message: "You have successfully added this goal" })
    }
}

export default GoalController;