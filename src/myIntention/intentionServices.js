import mongoose from "mongoose";
import MyIntention from "../../model/myIntention";
import commonService from "../../utils/commonServices";
import { BadRequestException, ConflictException, NotFoundException } from "../common/error-exceptions";

class IntentionServices {
    /**
     * @description: Intention add
     * @param {*} auth 
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     */
    static async intentionAdd(auth, data, req, res) {
        const { description } = data;
        const findInte = await commonService.findOne(MyIntention, { userId: auth });
        if (!findInte) {
            const addIntention = await commonService.createOne(MyIntention, {
                userId: auth,
                description: description
            });

            return addIntention;
        } else {
            throw new ConflictException('Intention already added')
        }
    }



    /**
     * @description: Intention get
     * @param {*} auth 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async getIntention(auth, req, res) {
        const findInte = await commonService.findOne(MyIntention, { userId: auth });
        // if (findInte) {
        return findInte
        // } else {
        //     // throw new NotFoundException("Intention not found")
        //     return res.send({ data: null })
        // }
    }




    /**
     * @description: Edit intrntions
     * @param {*} auth 
     * @param {*} id 
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async editIntention(auth, id, data, req, res) {
        const { description } = data;

        if (mongoose.Types.ObjectId.isValid(id)) {
            const findIntention = await commonService.findOne(MyIntention, { _id: id, userId: auth });
            if (findIntention) {
                const updateInte = await commonService.updateById(MyIntention, findIntention._id, {
                    description: description
                });

                return updateInte;
            } else {
                throw new BadRequestException("This intention id not found")
            }
        } else {
            throw new BadRequestException("Please provide correct intentionId")
        }
    }
}

export default IntentionServices;