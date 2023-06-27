import HabitsServices from "./habitsServices";


class HabitsController {
    /**
     * @description: Add habits
     * @param {*} req 
     * @param {*} res 
     */
    static async addHabits(req, res) {
        const data = await HabitsServices.addHabits(req.user._id, req.body, req, res);
        return res.send({ message: "You have successfully saved this habit." })
    }



    /**
     * @description: Get habit
     * @param {*} req 
     * @param {*} res 
     */
    static async getSingleHabit(req, res) {
        const data = await HabitsServices.getSingleHabit(req.params.id, req, res);
        return res.send({ data: data })
    }



    /**
     * @description: Mark as done habit
     * @param {*} req 
     * @param {*} res 
     */
    static async markAsDoneHabit(req, res) {
        const data = await HabitsServices.markAsDoneHabit(req.params.id, req, res);
        return res.send({ message: "Great work! You have completed this task." })
    }



    /**
     * @description: Habits listing
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async habitsListing(req, res) {
        const { data, meta } = await HabitsServices.habitsListing(req.user._id, req.query, req, res);
        return res.send({ data: data, meta });
    }



    /**
     * @description: Delete habits
     * @param {*} req 
     * @param {*} res 
     */
    static async deleteHabits(req, res) {
        const data = await HabitsServices.deleteHabits(req.params.id, req, res);
        return res.send({ message: "You have successfully deleted this habit." })
    }
}

export default HabitsController;