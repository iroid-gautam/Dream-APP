import CubZoneServices from "./cubZoneServices";


class CubZoneController {
    /**
     * @description: Listing cubzone page
     * @param {*} req 
     * @param {*} res 
     */
    static async cubzonelistingPage(req, res) {
        await CubZoneServices.cubzonelistingPage(req, res);
    }



    /**
     * @description: Get cubzone listing
     * @param {*} req 
     * @param {*} res 
     */
    static async getCubZoneListing(req, res) {
        await CubZoneServices.getCubZoneListing(req.query, req, res);
    }



    /**
     * @description: Add page 
     * @param {*} req 
     * @param {*} res 
     */
    static async cubZoneAddPage(req, res) {
        await CubZoneServices.cubZoneAddPage(req, res);
    }



    /**
     * @description: Add cobzone
     * @param {*} req 
     * @param {*} res 
     */
    static async addCubZone(req, res) {
        await CubZoneServices.addCubZone(req.files, req, res);
    }



    /**
     * @description: Delete cubzone
     * @param {*} req 
     * @param {*} res 
     */
    static async deleteCunZone(req, res) {
        await CubZoneServices.deleteCubZone(req.params.id, req, res);
    }
}

export default CubZoneController;