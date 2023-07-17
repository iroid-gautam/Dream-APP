import QuestionsServices from "./questionsServices";


class QuestionsController {
    /**
     * @description: Listing questions to contemplate
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async questionsToContemplateListing(req, res) {
        const { data, meta } = await QuestionsServices.questionsToContemplateListing(req.query, req, res);
        return res.send({ data: data, meta: meta });
    }
}

export default QuestionsController;