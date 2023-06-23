import mongoose from "mongoose";
import Emojis from "../../model/emojis";
import commonService from "../../utils/commonServices";
import { BadRequestException, NotFoundException } from "../common/error-exceptions";
import MentalState from "../../model/mentalState";

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
}

export default MentalStateServices;