import MyServices from "./myServices";

class MyController {
    /**
     * @description: Get mind and body description
     * @param {*} req 
     * @param {*} res 
     */
    static async getMyMindBody(req, res) {
        const data = await MyServices.getMyMindBody(req, res);
        return res.send({ data: Object.keys(data).length !== 0 ? data : null });
    }


    /**
     * @description: Get my inspiration
     * @param {*} req 
     * @param {*} res 
     */
    static async getMyInspiration(req, res) {
        const data = await MyServices.getMyInspiration(req, res);
        return res.send({ data: Object.keys(data).length !== 0 ? data : null })
    }
}

export default MyController;