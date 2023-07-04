// JWT AUTHENTICATION
import { JWT } from "../../common/constants/constant";
import jwt from "jsonwebtoken";

export default (req, res, next) => {
    if (req.session.token) {
        jwt.verify(req.session.token, JWT.SECRET, (err, decoded) => {
            if (err) {
                return res.redirect("/admin/login");
            } else {
                next();
            }
        });
    } else {
        return res.redirect("/admin/login");
    }
};