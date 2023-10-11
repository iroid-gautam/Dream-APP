import forgotServices from "./forgotServices";


class forgotController {
    /**
     * @description: Forgo password page
     * @param {*} req 
     * @param {*} res 
     */
    static async forgotPage(req, res) {
        await forgotServices.forgotPage(req, res);
    }



    /**
     * @description: Reset password link generate
     * @param {*} req 
     * @param {*} res 
     */
    static async resetPasswordLinkGenerate(req, res) {
        await forgotServices.resetPasswordLinkGenerate(req.body, req, res);
    }



    /**
     * @description: Forgot password page open in web
     * @param {*} req 
     * @param {*} res 
     */
    static async forgotPasswordPage(req, res) {
        await forgotServices.forgotPasswordPage(req.params.token, req, res)
    }



    /**
     * @description: Reset password from admin console
     * @param {*} req 
     * @param {*} res 
     */
    static async resetPassword(req, res) {
        await forgotServices.resetPassword(req.params.token, req.body, req, res)
    }
}

export default forgotController;