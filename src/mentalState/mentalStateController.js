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
}


export default MentalStateController;