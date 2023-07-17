import CubZone from "../../model/cubZone";
import commonService from "../../utils/commonServices";
import CubZoneResource from "./resources/listCubZone";

class CubZoneServices {
    /**
     * @description: Listing cubzone
     * @param {*} query 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async cunZoneListing(query, req, res) {
        const page = parseInt(query.page) - 1 || 0;
        const pageLimit = parseInt(query.limit) || 20;

        const findCubZone = await CubZone.find({}).skip(page * pageLimit).limit(pageLimit).sort({ createdAt: -1 });

        const totalDocument = await commonService.totalDocuments(CubZone, {});

        const meta = {
            total: totalDocument,
            perPage: pageLimit,
            currentPage: page + 1,
            lastPage: Math.ceil(totalDocument / pageLimit),
        }

        return { data: new CubZoneResource(findCubZone), meta: meta }
    }
}

export default CubZoneServices