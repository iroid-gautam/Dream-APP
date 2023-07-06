import InsightsServices from "./insightsServices";
import InsightsListingResource from "./resources/listingInsightsResource";

class InsightsController {
    /**
     * @description:  All insights listing
     * @param {*} req 
     * @param {*} res 
     */
    static async allInsightsListing(req, res) {
        const { data, meta } = await InsightsServices.allInsightsListing(req.query, req, res);
        return res.send({ data: new InsightsListingResource(data), meta });
    }



    /**
     * @description: Get single insights details
     * @param {*} req 
     * @param {*} res 
     */
    static async getSingleInsightsDetails(req, res) {
        const data = await InsightsServices.getSingleInsightsDetails(req.params.id, req, res);
        return res.send({ data: data });
    }
}

export default InsightsController;