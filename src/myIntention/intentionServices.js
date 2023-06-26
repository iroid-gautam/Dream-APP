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
        if (findInte) {
            return findInte
        } else {
            throw new NotFoundException("Intention not found")
        }
    }
}

export default IntentionServices;