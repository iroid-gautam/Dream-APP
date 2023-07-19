import AllCardsListingServices from "./allCardsListingServices";

class AllCardsListingController {
    /**
     * @description: get all cards listing 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async allCardsListing(req, res) {
        const data = await AllCardsListingServices.allCardsListing(req.user._id, req.query, req, res);
        return res.send({ data: Object.keys(data).length !== 0 ? data : null });
    }



    /**
     * @description: Flipped cards
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async flippedCardsAdd(req, res) {
        const data = await AllCardsListingServices.flippedCardsAdd(req.user._id, req.params.id, req, res);
        return res.send({ message: "Card flipped" });
    }
}

export default AllCardsListingController;