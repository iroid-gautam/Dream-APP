import InsightsServices from "./insightsServices";

class InsightsController {

    /**
     * @description: Listing insights page
     * @param {*} req 
     * @param {*} res 
     */
    static async listingInsightsPage(req, res) {
        await InsightsServices.listingInsightsPage(req, res);
    }



    /**
     * @description: Listing insights in datatable
     * @param {*} req 
     * @param {*} res 
     */
    static async listingInsights(req, res) {
        await InsightsServices.listingInsights(req.query, req, res);
    }


    /**
     * @description: insights add page
     * @param {*} req 
     * @param {*} res 
     */
    static async addInsightsPage(req, res) {
        await InsightsServices.addInsightsPage(req, res);
    }


    /**
     * @description: Insights add
     * @param {*} req 
     * @param {*} res 
     */
    static async insightsAdd(req, res) {
        await InsightsServices.insightsAdd(req.body, req.file, req, res);
    }



    /**
     * @description: Update page
     * @param {*} req 
     * @param {*} res 
     */
    static async updateInsightPage(req, res) {
        await InsightsServices.updateInsightPage(req.params.id, res);
    }



    /**
     * @description: Update insights by id
     * @param {*} req 
     * @param {*} res 
     */
    static async updateInsights(req, res) {
        await InsightsServices.updateInsights(req.body, req.file, req, res);
    }



    /**
     * @description: Insights delete
     * @param {*} req 
     * @param {*} res 
     */
    static async insightsDelete(req, res) {
        await InsightsServices.insightsDelete(req.params.id, req, res)
    }
}

export default InsightsController;