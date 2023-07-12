import Inspirational from "../../model/inspirational";
import commonService from "../../utils/commonServices";
import InspirationalResource from "./resources/listingInspirationalResources";


class InspirationalServices {
    /**
     * @description: Listing inspirational
     * @param {*} query 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async inspirationalListing(query, req, res) {
        const page = parseInt(query.page) - 1 || 0;
        const pageLimit = parseInt(query.limit) || 20;

        const findInspirational = await Inspirational.find({ type: query.type }).skip(page * pageLimit).limit(pageLimit).sort({ createdAt: -1 });

        const totalDocument = await commonService.totalDocuments(Inspirational, { type: query.type });

        const meta = {
            total: totalDocument,
            perPage: pageLimit,
            currentPage: page + 1,
            lastPage: Math.ceil(totalDocument / pageLimit),
        }

        return { data: new InspirationalResource(findInspirational), meta: meta }
    }
}

export default InspirationalServices;