import UserService from "./user.service";
import { baseUrl } from "../common/constants/constant";
import GetUserProfileResource from "./resources/getUserProfile";

class UserController {
    /**
     * get login user details
     * @param {*} req
     * @param {*} res
     */
    static async index(req, res) {
        const { data, isSub } = await UserService.index(req.user);

        return res.send({ data: new GetUserProfileResource(data, isSub) });
    }

    /**
     * update user
     * @param {*} req 
     * @param {*} res 
     */
    static async update(req, res) {

        const data = {
            user: req.user,
            reqData: req.body
        }

        await UserService.update(data);

        return res.send({ message: "Your profile has been saved" });
    }


    /**
    * @description : Delete User Account
    * @param {*} req 
    * @param {*} res 
    */
    static async deleteAccount(req, res) {
        await UserService.deleteAccount(req.user._id, req, res);
        return res.send({ message: "Account deleted successfully" });
    }


    /**
     * @description: Change email
     * @param {*} req 
     * @param {*} res 
     */
    static async emailChange(req, res) {
        const data = await UserService.emailChange(req.user._id, req.body);
        return res.send({ message: "OTP sent to your email address" })
    }



    /**
     * @description: OTP verified
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async emailVerifyOTP(req, res) {
        const data = await UserService.emailVerifyOTP(req.user, req.body);
        return res.send({ message: "OTP verified successfully" });
    }



    /**
       * @description: user picture update
       * @param {*} req 
       * @param {*} res 
       */
    static async userProfilePictureUpdate(req, res) {
        const data = await UserService.userProfilePictureUpdate(req.user._id, req.file, req, res);
        return res.send({ message: "Profile picture updated successfully" })
    }



    /**
     * @description: Change password
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async changePassword(req, res) {
        const data = await UserService.changePassword(req.user._id, req.body, req, res);
        return res.send({ message: "Your password has been changed successfully" })
    }
}

export default UserController;
