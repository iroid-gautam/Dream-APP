import Admin from "../../../model/admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT } from "../../common/constants/constant";

class changePasswordServices {

    /**
     * @description: Change password
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async changePassword(data, req, res) {
        const { currentPassword, newPassword, confirmPassword } = data;

        const decodeJwt = jwt.verify(req.session.token, JWT.SECRET);

        if (decodeJwt) {
            const userId = await Admin.findById(decodeJwt.id);

            const passwordMatch = await bcrypt.compare(currentPassword, userId.password);

            if (!passwordMatch) {
                req.flash('error', 'Current password is incorrect');
                return res.redirect('back');
            }

            const hashedPassword = await bcrypt.hash(newPassword, 12);

            await Admin.findByIdAndUpdate(userId._id, {
                password: hashedPassword
            })

            return res.redirect('/admin/logout');

        } else {
            req.flash('error', 'Something went wrong');
            return res.redirect('back');
        }
    }
}

export default changePasswordServices;