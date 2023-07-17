import CubZoneServices from "./cubzoneServices";


class CubZoneController {
    /**
     * @description: Listing cubzone
     * @param {*} req 
     * @param {*} res 
     */
    static async cunZoneListing(req, res) {
        const { data, meta } = await CubZoneServices.cunZoneListing(req.query, req, res);
        return res.send({ data: data, meta: meta });
    }
}

export default CubZoneController;