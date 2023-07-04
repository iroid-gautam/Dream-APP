import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../../../model/admin";
import { JWT } from "../../common/constants/constant";
import commonService from "../../../utils/commonServices";

class authServices {
    /**
     * @description: Login page load
     * @param {*} req 
     * @param {*} res 
     */
    static async index(req, res) {
        if (req.session.token) {
            jwt.verify(req.session.token, JWT.SECRET, (err, decoed) => {
                if (err) {
                    return res.render('admin/auth/login')
                } else {
                    return res.redirect('/admin/dashboard')
                }
            });
        } else {
            return res.render('admin/auth/login')
        }
    }



    /**
     * @description: Login with email
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     */
    static async login(data, req, res) {
        const { email, password } = data

        const findAdmin = await commonService.findOne(Admin, { email: email });
        if (!findAdmin) {
            req.flash('error', 'Invalid Email');
            return res.redirect('back');
        }

        const checkPassword = await bcrypt.compare(password, findAdmin.password);
        if (!checkPassword) {
            req.flash('error', 'Invalid Password');
            return res.redirect('back');
        }

        const payload = { id: findAdmin._id };

        jwt.sign(payload, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN }, (err, token) => {
            if (err) {
                return res.render('admin/errors/500');
            }

            req.session.token = token

            return res.redirect('/admin/dashboard')
        });
    }
}

export default authServices;