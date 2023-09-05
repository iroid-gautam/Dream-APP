import Inspirational from "../../model/inspirational";
import commonService from "../../utils/commonServices";
import InspirationalResource from "./resources/allCardsListingResources";
import Affirmation from "../../model/affirmations";
import QuestionsToContemplate from "../../model/questions";
import Strategy from "../../model/strategy";
import CubZone from "../../model/cubZone";
import CubZoneResource from "./resources/listCubZone";
import mongoose from "mongoose";
import { BadRequestException } from "../common/error-exceptions";
import FlippedCards from "../../model/flippedCards";
import AllCardsListingResource from "./resources/allCardsListingResources";
import UserSubscription from "../../model/userSubscription";
import moment from "moment";
import { PremiumUserFind } from "../common/helper";
class AllCardsListingServices {
    /**
     * @description: get all cards listing
     * @param {*} query 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async allCardsListing(auth, query, req, res) {
        // const page = parseInt(query.page) - 1 || 0;
        // const pageLimit = parseInt(query.limit) || 20;
        const { section, type } = query;

        if (section == 0) {
            // Inspirational quotes listing
            // const findInspirational = await Inspirational.find({ type: { $regex: type, $options: 'i' } }).skip(page * pageLimit).limit(pageLimit).sort({ createdAt: -1 });

            // const totalDocument = await commonService.totalDocuments(Inspirational, { type: { $regex: type, $options: 'i' } });

            // const meta = {
            //     total: totalDocument,
            //     perPage: pageLimit,
            //     currentPage: page + 1,
            //     lastPage: Math.ceil(totalDocument / pageLimit),
            // }

            // return { data: new InspirationalResource(findInspirational), meta: meta }

            const random = await Inspirational.aggregate([
                { $match: { type: type } },
                { $sample: { size: 1 } }
            ]);

            if (random.length === 0) {
                return true;
            } else {
                const findFlip = await commonService.findOne(FlippedCards, {
                    userId: auth,
                    cardId: random[0]._id
                });

                return { ...new AllCardsListingResource(random, findFlip) };
            }


        } else if (section == 1) {
            // Affirmations
            const random = await Affirmation.aggregate([
                { $match: { type: type } },
                { $sample: { size: 1 } }
            ]);

            if (random.length === 0) {
                return true;
            } else {
                const findFlip = await commonService.findOne(FlippedCards, {
                    userId: auth,
                    cardId: random[0]._id
                });

                return { ...new AllCardsListingResource(random, findFlip) };
            }

        } else if (section == 2) {
            // Questions to contemplate
            const random = await QuestionsToContemplate.aggregate([
                { $match: { type: type } },
                { $sample: { size: 1 } },
                {
                    $lookup: {
                        from: "videopodcasts",
                        localField: "videoRef",
                        foreignField: "_id",
                        as: "videos"
                    }
                }
            ]);

            if (random.length === 0) {
                return true;
            } else {
                const findFlip = await commonService.findOne(FlippedCards, {
                    userId: auth,
                    cardId: random[0]._id
                });

                return { ...new AllCardsListingResource(random, findFlip) };
            }

        } else if (section == 3) {
            // Strategy
            const random = await Strategy.aggregate([
                { $match: { type: type } },
                { $sample: { size: 1 } },
                {
                    $lookup: {
                        from: "videopodcasts",
                        localField: "videoRef",
                        foreignField: "_id",
                        as: "videos"
                    }
                }
            ]);

            if (random.length === 0) {
                return true;
            } else {
                const findFlip = await commonService.findOne(FlippedCards, {
                    userId: auth,
                    cardId: random[0]._id
                });

                return { ...new AllCardsListingResource(random, findFlip) };
            }

        } else if (section == 4) {
            // Cubzone
            // const findCubZone = await CubZone.find({}).skip(page * pageLimit).limit(pageLimit).sort({ createdAt: -1 });

            // const totalDocument = await commonService.totalDocuments(CubZone, {});

            // const meta = {
            //     total: totalDocument,
            //     perPage: pageLimit,
            //     currentPage: page + 1,
            //     lastPage: Math.ceil(totalDocument / pageLimit),
            // }

            // return { data: new CubZoneResource(findCubZone), meta: meta }
            const random = await CubZone.aggregate([
                // { $match: { type: type } },
                { $sample: { size: 1 } }
            ]);

            if (random.length === 0) {
                return true;
            } else {
                const findFlip = await commonService.findOne(FlippedCards, {
                    userId: auth,
                    cardId: random[0]._id
                });

                return { ...new AllCardsListingResource(random, findFlip) };
            }
        }
    }




    /**
     * @description: Flipped card
     * @param {*} auth 
     * @param {*} id 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async flippedCardsAdd(auth, id, type) {
        if (mongoose.Types.ObjectId.isValid(id)) {

            const isSub = await PremiumUserFind(auth);

            if (isSub === true) {
                const createFlip = await commonService.createOne(FlippedCards, {
                    userId: auth,
                    cardId: id,
                    type: type
                });
                return createFlip;
            } else {
                const currentDate = moment().format('YYYY-MM-DD');
                const alreadyAdd = await FlippedCards.find({
                    userId: auth,
                    type: type,
                    $expr: {
                        $eq: [
                            { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                            { $dateToString: { format: "%Y-%m-%d", date: { $toDate: currentDate } } }
                        ]
                    }
                })

                if (alreadyAdd.length > 0) {
                    throw new BadRequestException("Please purchase premium plan and unlimited cards flipped")
                } else {
                    const createFlip = await commonService.createOne(FlippedCards, {
                        userId: auth,
                        cardId: id,
                        type: type
                    });
                    return createFlip;
                }
            }

        } else {
            throw new BadRequestException("Please provide correct card id")
        }
    }
}

export default AllCardsListingServices;