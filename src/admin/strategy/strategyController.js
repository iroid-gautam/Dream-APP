import StrategyServices from "./strategyServices";



class StrategyController {
    /**
     * @description: Listing page strategy
     * @param {*} req 
     * @param {*} res 
     */
    static async listingStrategyPage(req, res) {
        await StrategyServices.listingStrategyPage(req, res);
    }



    /**
     * @description: Get listing strategy
     * @param {*} req 
     * @param {*} res 
     */
    static async getListingStrategy(req, res) {
        await StrategyServices.getListingStrategy(req.query, req, res);
    }



    /**
     * @description: Add page for strategy
     * @param {*} req 
     * @param {*} res 
     */
    static async addStrategyPage(req, res) {
        await StrategyServices.addStrategyPage(req, res);
    }




    /**
     * @description: Add strategy
     * @param {*} req 
     * @param {*} res 
     */
    static async addStrategy(req, res) {
        await StrategyServices.addStrategy(req.body, req.files, req, res);
    }



    /**
     * @description: Delete strategy
     * @param {*} req 
     * @param {*} res 
     */
    static async deleteStrategy(req, res) {
        await StrategyServices.deleteStrategy(req.params.id, req, res);
    }
}

export default StrategyController;