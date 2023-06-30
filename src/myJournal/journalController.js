import JournalServices from "./journalServices";



class JournalController {
    /**
     * @description: Add journal
     * @param {*} req 
     * @param {*} res 
     */
    static async addJournal(req, res) {
        const data = await JournalServices.addJournal(req.user._id, req.file, req.body, req, res);
        return res.send({ message: "You have successfully saved this journal." })
    }



    /**
     * @description: Get journal listing
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async getAllJournalListing(req, res) {
        const { data, meta } = await JournalServices.getAllJournalListing(req.user._id, req.query, req, res);
        return res.send({ data: Object.keys(data).length > 0 ? data : null, meta: meta })
    }
}

export default JournalController;