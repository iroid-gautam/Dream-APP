import commonService from "../../utils/commonServices";
import QuestionsToContemplate from "../../model/questions";
import InspirationalResource from "../inspirationalQuotes/resources/listingInspirationalResources";

class QuestionsServices {
    /**
     * @description: listing auestions to contemplate
     * @param {*} query 
     * @param {*} req 
     * @param {*} res 
     */
    static async questionsToContemplateListing(query, req, res) {
        const page = parseInt(query.page) - 1 || 0;
        const pageLimit = parseInt(query.limit) || 20;
        const { type } = query;

        const findQuestion = await QuestionsToContemplate.find({ type: { $regex: type, $options: 'i' } }).skip(page * pageLimit).limit(pageLimit).sort({ createdAt: -1 });

        const totalDocument = await commonService.totalDocuments(QuestionsToContemplate, { type: { $regex: type, $options: 'i' } });

        const meta = {
            total: totalDocument,
            perPage: pageLimit,
            currentPage: page + 1,
            lastPage: Math.ceil(totalDocument / pageLimit),
        }

        return { data: new InspirationalResource(findQuestion), meta: meta }
    }
}

export default QuestionsServices;