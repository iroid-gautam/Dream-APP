import InspirationalServices from "./inspirationalServices";



class InspirationalController {
    /**
     * @description: Listing inspirational
     * @param {*} req 
     * @param {*} res 
     */
    static async listingInspirationPage(req, res) {
        await InspirationalServices.listingInspirationPage(req, res);
    }



    /**
     * @description: Get inspirational
     * @param {*} req 
     * @param {*} res 
     */
    static async getListingInspirational(req, res) {
        await InspirationalServices.getListingInspirational(req.query, req, res);
    }



    /**
     * @description: Add inspirational page
     * @param {*} req 
     * @param {*} res 
     */
    static async addInspirationPage(req, res) {
        await InspirationalServices.addInspirationPage(req, res);
    }



    /**
     * @description: Add Inspiration
     * @param {*} req 
     * @param {*} res 
     */
    static async addInspiration(req, res) {
        await InspirationalServices.addInspiration(req.body, req.files, req, res);
    }



    /**
     * @description: Delete inspirational
     * @param {*} req 
     * @param {*} res 
     */
    static async deleteInspirational(req, res) {
        await InspirationalServices.deleteInspirational(req.params.id, req, res);
    }

}

export default InspirationalController;