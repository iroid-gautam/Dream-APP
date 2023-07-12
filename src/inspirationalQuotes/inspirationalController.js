import InspirationalServices from "./inspirationalServices";


class InspirationalController {
    /**
     * @description: Listing inspirational
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async inspirationalListing(req, res) {
        const { data, meta } = await InspirationalServices.inspirationalListing(req.query, req, res);
        return res.send({ data: data, meta: meta });
    }
}

export default InspirationalController;