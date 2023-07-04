import User from "../../../model/user";
import commonService from "../../../utils/commonServices";

class dashboardController {
    /**
     * @description : Dashboard page load
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async dashboard(req, res) {
        const users = await commonService.totalDocuments(User, {})
        return res.render('admin/dashboard', { "users": users });
    }
}

export default dashboardController;