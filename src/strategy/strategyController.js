import StrategyServices from "./strategyServices";


class StrategyController {
    /**
     * @description: Listing strategy
     * @param {*} req 
     * @param {*} res 
     */
    static async startegyListing(req, res) {
        const { data, meta } = await StrategyServices.startegyListing(req.query, req, res);
        return res.send({ data: data, meta: meta });
    }
}

export default StrategyController;