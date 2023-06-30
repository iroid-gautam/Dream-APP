import MentalStateServices from "./mentalStateServices";

class MentalStateController {
    /**
     * @description: Emojis listing
     * @param {*} req 
     * @param {*} res 
     */
    static async emojiListing(req, res) {
        const data = await MentalStateServices.emojiListing(req, res);
        return res.send({ data: data })
    }


    /**
     * @description: Mental score add
     * @param {*} req 
     * @param {*} res 
     */
    static async addMentalScore(req, res) {
        const data = await MentalStateServices.addMentalScore(req.user._id, req.body, req, res);
        return res.send({ message: "Score added successfully" })
    }




    /**
     * @description: Get mental score
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async getMentalScore(req, res) {
        const data = await MentalStateServices.getMentalScore(req.user._id, req, res);
        return res.send({ data: data != null ? data : null });
    }



    /**
     * @description: Over all score find mental state
     * @param {*} req 
     * @param {*} res 
     */
    static async overAllScoreFind(req, res) {
        const data = await MentalStateServices.overAllScoreFind(req.user._id, req, res);
        return res.send({ data: data })
    }
}


export default MentalStateController;