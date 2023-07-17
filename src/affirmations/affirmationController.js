import AffirmationServices from "./affirmationServices";


class AffirmationController {
    /**
     * @description: Affirmation listing
     * @param {*} req 
     * @param {*} res 
     */
    static async affirmationsListing(req, res) {
        const { data, meta } = await AffirmationServices.affirmationsListing(req.query, req, res);
        return res.send({ data: data, meta: meta });
    }
}

export default AffirmationController;