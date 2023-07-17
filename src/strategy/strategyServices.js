import Strategy from "../../model/strategy";
import commonService from "../../utils/commonServices";
import InspirationalResource from "../inspirationalQuotes/resources/listingInspirationalResources";


class StrategyServices {
    /**
     * @description: Strategy listing
     * @param {*} query 
     * @param {*} req 
     * @param {*} res 
     */
    static async startegyListing(query, req, res) {
        const page = parseInt(query.page) - 1 || 0;
        const pageLimit = parseInt(query.limit) || 20;
        const { type } = query;

        const findStrategy = await Strategy.find({ type: { $regex: type, $options: 'i' } }).skip(page * pageLimit).limit(pageLimit).sort({ createdAt: -1 });

        const totalDocument = await commonService.totalDocuments(Strategy, { type: { $regex: type, $options: 'i' } });

        const meta = {
            total: totalDocument,
            perPage: pageLimit,
            currentPage: page + 1,
            lastPage: Math.ceil(totalDocument / pageLimit),
        }

        return { data: new InspirationalResource(findStrategy), meta: meta }
    }
}

export default StrategyServices;