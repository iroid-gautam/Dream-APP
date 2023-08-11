import UserService from "./user.service";
import { baseUrl } from "../common/constants/constant";

class UserController {
    /**
     * get login user details
     * @param {*} req
     * @param {*} res
     */
    static async index(req, res) {
        const data = await UserService.index(req.user);

        if (data.profileImage) {
            data.profileImage = data.profileImage ? baseUrl(data.profileImage) : null;
        }
        return res.send({ data: data });
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
