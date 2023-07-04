import authServices from "./authServices";

class authController {
    /**
     * @description: Login page load
     * @param {*} req 
     * @param {*} res 
     */
    static async index(req, res) {
        await authServices.index(req, res);
    }


    /**
     * @description: Login with email
     * @param {*} req 
     * @param {*} res 
     */
    static async login(req, res) {
        await authServices.login(req.body, req, res);
    }

    

    /**
     * @description : Logout admin
     * @param {*} req 
     * @param {*} res 
     */
    static async logout(req, res) {
        delete req.session.token
        return res.redirect("/admin/login")
    }
}

export default authController;