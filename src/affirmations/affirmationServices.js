import Affirmation from "../../model/affirmations";
import commonService from "../../utils/commonServices";
import InspirationalResource from "../inspirationalQuotes/resources/listingInspirationalResources";

class AffirmationServices {
    /**
     * @description Affirmations listing
     * @param {*} query 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async affirmationsListing(query, req, res) {
        const page = parseInt(query.page) - 1 || 0;
        const pageLimit = parseInt(query.limit) || 20;
        const { type } = query;

        const findInspirational = await Affirmation.find({ type: { $regex: type, $options: 'i' } }).skip(page * pageLimit).limit(pageLimit).sort({ createdAt: -1 });

        const totalDocument = await commonService.totalDocuments(Affirmation, { type: { $regex: type, $options: 'i' } });

        const meta = {
            total: totalDocument,
            perPage: pageLimit,
            currentPage: page + 1,
            lastPage: Math.ceil(totalDocument / pageLimit),
        }

        return { data: new InspirationalResource(findInspirational), meta: meta }
    }
}

export default AffirmationServices;