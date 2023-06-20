import commonService from "../../utils/commonServices";
import AuthHelper from "../common/auth.helper";
import { logo } from "../common/helper";
import resetPasswordService from "./reset-password.service";

class resetPasswordController {
  /**
   * reset password get method
   * @param {*} req
   * @param {*} res
   */
  static async resetPasswordGet(req, res) {

    try {
      const reset = await resetPasswordService.resetPasswordGet(req.query.email);

      console.log(reset);
      return res.render("resetPassword/index", {
        logo: logo(),
        email: req.query.email,
        flag: `${reset}`,
        success: "false",
      });
    } catch (e) {
      res.send("Internal server error");
    }


    // return res.render("resetPassword/index", {
    //   logo: logo(),
    //   email: req.query.email,
    //   flag : "true",
    //   success : "false"
    // });
  }

  /**
   * reset password post method
   * @param {*} req
   * @param {*} res
   */
  static async resetPasswordPost(req, res) {
    
    const resetpwd = await resetPasswordService.resetPasswordPost(req.body);

    console.log(resetpwd);
    if (resetpwd) {
      return res.render("resetPassword/index", {
        email: req.query.email,
        flag: "true",
        success: "true",
        logo: logo(),
      });
    } else {
      return res.render("resetPassword/index", {
        email: "",
        flag: "false",
        success: "false",
        logo: logo(),
      });
    }
    // const decryptData = await jwt.verify(req.body.email, JWT.SECRET);

    // if(decryptData) {
    //     console.log(1);
    //     const update = await resetPasswordService.resetPasswordPost(decryptData);

    //     if(update) {
    //         return res.render("resetPassword/index", {
    //             email: "",
    //             flag: true,
    //             success: true,
    //             logo: logo(),
    //         });
    //     }
    // } else {
    //     console.log(2);
    //     return res.render("resetPassword/index", {
    //         email: "",
    //         flag: false,
    //         success: false,
    //         logo: logo(),
    //     });
    // }
    // if(decryptData) {

    //     if (ObjectId.isValid(user._id)) {

    //     }
    //     // const update = await commonService.updateOne(User, { _id : })
    // }

    // console.log(decryptData);
    // return res.render("resetPassword/index", { logo: logo() });
  }
}

export default resetPasswordController;
