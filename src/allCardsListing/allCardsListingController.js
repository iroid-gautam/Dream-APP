import AllCardsListingServices from "./allCardsListingServices";


class AllCardsListingController {
    /**
     * @description: get all cards listing 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async allCardsListing(req, res) {
        const { data, meta } = await AllCardsListingServices.allCardsListing(req.query, req, res);
        return res.send({ data: data, meta: meta });
    }
}

export default AllCardsListingController;