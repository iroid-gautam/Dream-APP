import MyInspiration from "../../model/myInspiration";
import MyMindBody from "../../model/mindAndBody";
import commonService from "../../utils/commonServices";
import { NotFoundException } from "../common/error-exceptions";


class MyServices {
    /**
     * @description: mind body get
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async getMyMindBody(req, res) {
        const findMindBody = await commonService.findAllRecord(MyMindBody, {});
        if (findMindBody) {
            return findMindBody;
        } else {
            throw new NotFoundException('Mind body not found');
        }
    }



    /**
     * @description: Get my inspiration
     * @param {*} req 
     * @param {*} res 
     */
    static async getMyInspiration(req, res) {
        const findInspiration = await commonService.findAllRecord(MyInspiration, {});
        if (findInspiration) {
            return findInspiration;
        } else {
            throw new NotFoundException('Inspiration not found')
        }
    }
}

export default MyServices;