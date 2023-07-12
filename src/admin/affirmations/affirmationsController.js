import AffirmationServices from "./affirmationsServices";

class AffirmationController {
    /**
     * @description: listing page
     * @param {*} req 
     * @param {*} res 
     */
    static async listingAffirmationsPage(req, res) {
        await AffirmationServices.listingAffirmationsPage(req, res);
    }



    /**
     * @description: Get listing
     * @param {*} req 
     * @param {*} res 
     */
    static async getListingAffirmations(req, res) {
        await AffirmationServices.getListingAffirmations(req.query, req, res);
    }




    /**
     * @description: Add affirmations page
     * @param {*} req 
     * @param {*} res 
     */
    static async addAffirmationsPage(req, res) {
        await AffirmationServices.addAffirmationsPage(req, res);
    }



    /**
     * @description: add affirmations
     * @param {*} req 
     * @param {*} res 
     */
    static async addAffirmations(req, res) {
        await AffirmationServices.addAffirmations(req.body, req.files, req, res)
    }



    /**
     * @description: Delete affirmations
     * @param {*} req 
     * @param {*} res 
     */
    static async deleteAffirmations(req, res) {
        await AffirmationServices.deleteAffirmations(req.params.id, req, res);
    }
}

export default AffirmationController;