import QuestionsToContemplateServices from "./questionsServices";

class QuestionsToContemplateController {
    /**
     * @description: Listing page
     * @param {*} req 
     * @param {*} res 
     */
    static async questionsListingPage(req, res) {
        await QuestionsToContemplateServices.questionsListingPage(req, res);
    }



    /**
     * @description: Get listing
     * @param {*} req 
     * @param {*} res 
     */
    static async getListingQuestions(req, res) {
        await QuestionsToContemplateServices.getListingQuestions(req.query, req, res);
    }



    /**
     * @description: Add question page
     * @param {*} req 
     * @param {*} res 
     */
    static async addQuestionsPage(req, res) {
        await QuestionsToContemplateServices.addQuestionsPage(req, res);
    }



    /**
     * @description: Add quetions to contemplate
     * @param {*} req 
     * @param {*} res 
     */
    static async addQuestionsContemplate(req, res) {
        await QuestionsToContemplateServices.addQuestionsContemplate(req.body, req.files, req, res);
    }



    /**
     * @description: Delete questions
     * @param {*} req 
     * @param {*} res 
     */
    static async deleteQuestions(req, res) {
        await QuestionsToContemplateServices.deleteQuestions(req.params.id, req, res);
    }
}

export default QuestionsToContemplateController;