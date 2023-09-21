const { ObjectId } = require("mongodb");
import jwt from "jsonwebtoken";
import { JWT, BCRYPT } from "../common/constants/constant";
import commonService from "../../utils/commonServices";
import User from "../../model/user";
import bcrypt from "bcryptjs";

class resetPasswordService {
  /**
   *
   * @param {*} data
   * @returns
   */
  static async resetPasswordGet(data) {
    if (!data) {
      return false;
    } else {
      try {
        const tokenVerify = await jwt.verify(
          data,
          JWT.SECRET,
          async (error, userData) => {
            if (error) {
              return false;
            } else {
              const email = userData.email;
              const whereEmail = { email };
              const userExist = await commonService.findOne(User, whereEmail);
              if (!(userExist.resetToken === data)) {
                return false;
              }
              return true;
            }
          }
        );
        return tokenVerify;
      } catch (error) {
        return false;
      }
    }
  }
  /**
   * reset password
   * @param {*} data
   */
  static async resetPasswordPost(data) {
    const reset = await jwt.verify(
      data.email,
      JWT.SECRET,
      async (error, udata) => {
        if (error) {
          return false;
        } else {
          
          const id = udata.id;
          const checkUser = await commonService.findOne(User, { _id: udata.id });

          if (!checkUser) {
            return false;
          } else {
            const pwd = await bcrypt.hash(data.password, BCRYPT.SALT_ROUND);
            const update = await commonService.updateOne(
              User,
              { _id: checkUser._id },
              { password: pwd,  resetToken: null }
            );
            return true;
          }
        }
      }
    );

    return reset;
    // if(ObjectId.isValid(data.id)) {
    //     console.log("yes");
    // } else {
    //     console.log("something went wrong.");
    // }
  }
}

export default resetPasswordService;
