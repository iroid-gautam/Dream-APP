import Inspirational from "../../model/inspirational";
import commonService from "../../utils/commonServices";
import InspirationalResource from "./resources/allCardsListingResources";
import Affirmation from "../../model/affirmations";
import QuestionsToContemplate from "../../model/questions";
import Strategy from "../../model/strategy";
import CubZone from "../../model/cubZone";
import CubZoneResource from "./resources/listCubZone";

class AllCardsListingServices {
    /**
     * @description: get all cards listing
     * @param {*} query 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async allCardsListing(query, req, res) {
        const page = parseInt(query.page) - 1 || 0;
        const pageLimit = parseInt(query.limit) || 20;
        const { section, type } = query;

        if (section == 0) {
            // Inspirational quotes listing
            const findInspirational = await Inspirational.find({ type: { $regex: type, $options: 'i' } }).skip(page * pageLimit).limit(pageLimit).sort({ createdAt: -1 });

            const totalDocument = await commonService.totalDocuments(Inspirational, { type: { $regex: type, $options: 'i' } });

            const meta = {
                total: totalDocument,
                perPage: pageLimit,
                currentPage: page + 1,
                lastPage: Math.ceil(totalDocument / pageLimit),
            }

            return { data: new InspirationalResource(findInspirational), meta: meta }

        } else if (section == 1) {
            // Affirmations
            const findAffirmation = await Affirmation.find({ type: { $regex: type, $options: 'i' } }).skip(page * pageLimit).limit(pageLimit).sort({ createdAt: -1 });

            const totalDocument = await commonService.totalDocuments(Affirmation, { type: { $regex: type, $options: 'i' } });

            const meta = {
                total: totalDocument,
                perPage: pageLimit,
                currentPage: page + 1,
                lastPage: Math.ceil(totalDocument / pageLimit),
            }

            return { data: new InspirationalResource(findAffirmation), meta: meta }

        } else if (section == 2) {
            // Questions to contemplate
            const findQuestion = await QuestionsToContemplate.find({ type: { $regex: type, $options: 'i' } }).skip(page * pageLimit).limit(pageLimit).sort({ createdAt: -1 });

            const totalDocument = await commonService.totalDocuments(QuestionsToContemplate, { type: { $regex: type, $options: 'i' } });

            const meta = {
                total: totalDocument,
                perPage: pageLimit,
                currentPage: page + 1,
                lastPage: Math.ceil(totalDocument / pageLimit),
            }

            return { data: new InspirationalResource(findQuestion), meta: meta }

        } else if (section == 3) {
            // Strategy
            const findStrategy = await Strategy.find({ type: { $regex: type, $options: 'i' } }).skip(page * pageLimit).limit(pageLimit).sort({ createdAt: -1 });

            const totalDocument = await commonService.totalDocuments(Strategy, { type: { $regex: type, $options: 'i' } });

            const meta = {
                total: totalDocument,
                perPage: pageLimit,
                currentPage: page + 1,
                lastPage: Math.ceil(totalDocument / pageLimit),
            }

            return { data: new InspirationalResource(findStrategy), meta: meta }

        } else if (section == 4) {
            // Cubzone
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
}

export default AllCardsListingServices;