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

    if(data.profileImage) {
        data.profileImage =  data.profileImage ? baseUrl(data.profileImage) : null; 
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
        user : req.user,
        reqData : req.body
    }

    await UserService.update(data);

    return res.send({ message : "Your profile has been saved" });
  }
}

export default UserController;
