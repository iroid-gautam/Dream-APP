import usersServices from "./usersServices";

class usersController {
    /**
     * @description: User page load
     * @param {*} req 
     * @param {*} res 
     */
    static async usersPage(req, res) {
        await usersServices.usersPage(req, res);
    }



    /**
     * @description: View users
     * @param {*} req 
     * @param {*} res 
     */
    static async viewUsers(req, res) {
        await usersServices.viewUsers(req.query, req, res)
    }
}

export default usersController;