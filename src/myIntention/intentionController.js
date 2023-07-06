import IntentionServices from "./intentionServices";

class IntentionController {
    /**
     * @description: Intention add
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async intentionAdd(req, res) {
        const data = await IntentionServices.intentionAdd(req.user._id, req.body, req, res);
        return res.send({ message: 'Intention add successfully' });
    }


    /**
     * @description: Get intention
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async getIntention(req, res) {
        const data = await IntentionServices.getIntention(req.user, req, res);
        return res.send({ data: data !== null ? data : null });
    }



    /**
     * @description: Edit intention
     * @param {*} req 
     * @param {*} res 
     */
    static async editIntention(req, res) {
        const data = await IntentionServices.editIntention(req.user._id, req.params.id, req.body, req, res);
        return res.send({ message: "Intention updated successfully" })
    }
}

export default IntentionController;