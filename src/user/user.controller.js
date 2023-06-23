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
       * @description: user picture update
       * @param {*} req 
       * @param {*} res 
       */
    static async userProfilePictureUpdate(req, res) {
        const data = await UserService.userProfilePictureUpdate(req.user._id, req.file, req, res);
        return res.send({ message: "Profile picture updated successfully" })
    }
}

export default UserController;
