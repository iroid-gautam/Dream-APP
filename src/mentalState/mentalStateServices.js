import mongoose from "mongoose";
import Emojis from "../../model/emojis";
import commonService from "../../utils/commonServices";
import { BadRequestException, NotFoundException } from "../common/error-exceptions";
import MentalState from "../../model/mentalState";
import { ObjectId } from "mongodb";
import moment from "moment";
import GetMentalScoreResource from "./resources/getMentalScoreResource";
import OverAllScoreResource from "./resources/overallScore";

class MentalStateServices {
    /**
     * @description: Emojis listing
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async emojiListing(req, res) {
        try {
            const findEmoji = await commonService.findAllRecord(Emojis, {});
            if (findEmoji.length === 0) {
                throw new NotFoundException("Emojis are not found")
            }

            return findEmoji;
        } catch (err) {
            throw new BadRequestException('Something went wrong')
        }
    }




    /**
     * @description: Mental score add
     * @param {*} auth 
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async addMentalScore(auth, data, req, res) {
        const { emojiId, score } = data;

        if (mongoose.Types.ObjectId.isValid(emojiId)) {
            const emojiFind = await commonService.findOne(Emojis, { _id: emojiId });
            if (emojiFind) {
                if (score < 11) {
                    const addScore = await commonService.createOne(MentalState, {
                        userId: auth,
                        score: score,
                        emojiId: emojiFind._id
                    });

                    return addScore;
                } else {
                    throw new BadRequestException('Only add 1 to 10 score')
                }

            } else {
                throw new NotFoundException("This emoji is not found")
            }
        } else {
            throw new BadRequestException("Please provide correct emojiId")
        }
    }



    /**
     * @description: Mental score get
     * @param {*} auth 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async getMentalScore(auth, req, res) {
        const currentDate = moment().format('YYYY-MM-DD');
        // const currentDate = moment().format('2023-06-30');

        // const alreadyAdd = await MentalState.aggregate([
        //     {
        //         $match: { userId: new ObjectId(auth) }
        //     },
        //     {
        //         $match: {
        //             $expr: {
        //                 $eq: [{ $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, currentDate]
        //             }
        //         }
        //     }
        // ])
        const alreadyAdd = await MentalState.findOne({
            userId: auth,
            $expr: {
                $eq: [
                    { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    { $dateToString: { format: "%Y-%m-%d", date: { $toDate: currentDate } } }
                ]
            }
        });

        if (alreadyAdd) {
            const updateStatus = await commonService.updateById(MentalState, alreadyAdd._id, { added: true });

            return { ...new GetMentalScoreResource(updateStatus) };
        }
    }




    static async overAllScoreFind(auth, req, res) {

        // Current week data

        const currentDate = new Date();

        const currenyWeek = new Date(currentDate);
        currenyWeek.setDate(currentDate.getDate() - currentDate.getDay());

        const endingWeek = new Date(currenyWeek);
        endingWeek.setDate(currenyWeek.getDate() + 6);

        const totalAvg = await MentalState.aggregate([
            {
                $match: {
                    userId: new ObjectId(auth),
                    createdAt: {
                        $gte: currenyWeek,
                        $lt: endingWeek
                    }
                }
            },
            { $group: { _id: null, total: { $sum: '$score' } } }
        ]);

        const totalDocument = await commonService.totalDocuments(MentalState, { userId: auth, createdAt: { $gte: currenyWeek, $lt: endingWeek } });

        const averageScore = (totalAvg.length > 0) ? totalAvg[0].total / totalDocument : 0;
        const currentWeek10Score = averageScore / 10 * 10;

        // Last week data

        const lastWeekStartDate = new Date(currentDate);
        lastWeekStartDate.setDate(currentDate.getDate() - currentDate.getDay() - 6);

        const lastWeekEndDate = new Date(lastWeekStartDate);
        lastWeekEndDate.setDate(lastWeekStartDate.getDate() + 6);

        const lastWeekTotalAvg = await MentalState.aggregate([
            {
                $match: {
                    userId: new ObjectId(auth),
                    createdAt: {
                        $gte: lastWeekStartDate,
                        $lt: lastWeekEndDate
                    }
                }
            },
            { $group: { _id: null, total: { $sum: '$score' } } }
        ]);

        const lastWeekTotalDocument = await commonService.totalDocuments(MentalState, { userId: auth, createdAt: { $gte: lastWeekStartDate, $lt: lastWeekEndDate } });

        const lastWeekScore = (lastWeekTotalAvg.length > 0) ? lastWeekTotalAvg[0].total / lastWeekTotalDocument : 0;
        const lastWeek10Score = lastWeekScore / 10 * 10;

        // console.log("last week outOf10Score", lastWeek10Score);

        const week = { current: parseInt(currentWeek10Score), lastWeek: parseInt(lastWeek10Score) }

        return { ...new OverAllScoreResource(week) }

    }
}

export default MentalStateServices;