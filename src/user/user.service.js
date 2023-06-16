import commonService from "../../utils/commonServices";
import User from "../../model/user";
import {
  ConflictException,
  UnprocesssableEntityException,
} from "../common/error-exceptions";
const { ObjectId } = require("mongodb");

class UserService {
  /**
   * get login user details
   * @param {*} user
   */
  static async index(user) {
    if (ObjectId.isValid(user._id)) {
      const data = await commonService.findOne(User, { _id: user._id });
      return data;
    } else {
      throw new UnprocesssableEntityException("User id invalid");
    }
  }

  /**
   * update user
   * @param {*} data
   */
  static async update(data) {
    if (data.reqData.email) {
      const query = {
        email: data.reqData.email,
        _id: { $ne: data.user._id },
      };
      const checkExistEmail = await commonService.findOne(User, query);

      if (checkExistEmail) {
        throw new ConflictException("Email already exist");
      }
    }
    await commonService.updateOne(User, { _id: data.user._id }, data.reqData);

    return true;
  }
}

export default UserService;
