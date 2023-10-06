import changePasswordServices from "./changeServices";


class changePasswordController {
    /**
     * @description: Change password page
     * @param {*} req 
     * @param {*} res 
     */
    static async changePassPage(req, res) {
        return res.render('admin/changePassword/change')
    }


    /**
     * @description: Change password
     * @param {*} req 
     * @param {*} res 
     */
    static async changePassword(req, res) {
        await changePasswordServices.changePassword(req.body, req, res)
    }
}

export default changePasswordController;