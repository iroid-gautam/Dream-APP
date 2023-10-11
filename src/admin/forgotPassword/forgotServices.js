import Admin from "../../../model/admin";
import sendMail from "../../../src/common/middlewares/send-mail.middleware";
import jwt from "jsonwebtoken";
import { baseUrl, JWT, BCRYPT } from "../../common/constants/constant";
import { logo } from "../../common/helper";
import bcrypt from "bcryptjs";

class forgotServices {
    /**
     * @description: Forgot password page
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async forgotPage(req, res) {
        return res.render('admin/adminForgotPassword/forgotPage');
    }



    /**
     * @description : reset password link generate
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async resetPasswordLinkGenerate(data, req, res) {
        const { email } = data;
        const findAdmin = await Admin.findOne({ email: email });
        if (!findAdmin) {
            req.flash('error', 'This email is not found')
            return res.redirect("back");
        } else {
            const token = jwt.sign({ id: findAdmin._id, email: findAdmin.email }, JWT.SECRET, { expiresIn: 300 });
            const url = baseUrl(`admin/forgotPassword/forgotPage/${token}`);

            const obj = {
                url: url,
                subject: "Admin Console Reset Password",
                to: findAdmin.email,
            };

            await Admin.findOneAndUpdate(findAdmin._id, {
                refKey: true
            });

            sendMail(obj, 'reset-password-mail');

            req.flash('success', 'Reset password link sent to your email.');
            return res.redirect("/admin/login");
        }
    }



    /**
     * @description: Forgot password in web page
     * @param {*} token 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async forgotPasswordPage(token, req, res) {
        try {
            const verifyToken = jwt.verify(token, JWT.SECRET);
            const forgotRefKey = await Admin.findOne({ _id: verifyToken.id });
            if (verifyToken) {
                return res.render('resetPassword/resetAdmin', { layout: "resetPassword/resetAdmin", "forgotPassRefKey": forgotRefKey, logo: logo(), })
            }
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(403).send({ message: "Your link has been expired" });
            }
            return res.status(403).send({ message: "Invalid token" });
        }
    }




    /**
     * @description: Reset password from admin console
     * @param {*} token 
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async resetPassword(token, data, req, res) {
        const { password, password_confirmation } = data;
        const isValid = jwt.verify(token, JWT.SECRET);
        if (isValid) {
            if (password === password_confirmation) {
                const hashPass = await bcrypt.hash(password, BCRYPT.SALT_ROUND);
                const findId = await Admin.findByIdAndUpdate(isValid.id, { password: hashPass, refKey: false });
                if (findId) {
                    req.flash('success', 'Password has been changed');
                    return res.redirect('back');
                }
            } else {
                req.flash('error', 'Password and confirm password does not match');
                return res.redirect('back');
            }

        } else {
            req.flash('error', 'Link has been Expired');
            return res.redirect('back');
        }
    }
}

export default forgotServices;