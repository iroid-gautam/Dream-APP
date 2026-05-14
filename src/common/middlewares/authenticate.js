import AccessToken from "../../../model/accessToken";
import { HttpStatus } from "../error-exceptions";
import passport from "passport";
import CommonService from "../services/common.service";

export default (req, res, next) => {
  passport.authenticate("jwt", { session: false }, async (err, user) => {
    if (err || !user) {
      return res
        .status(HttpStatus.UNAUTHORIZED_EXCEPTION)
        .send({ message: "Unauthorized" });
    }

    if (user.isDeleted) {
      return res
        .status(HttpStatus.UNAUTHORIZED_EXCEPTION)
        .send({ message: "Unauthorized" });
    }

    const exist = await CommonService.findOne(AccessToken, {
      token: user.jti,
      isRevoked: false,
      userId: user.id,
    });

    if (!exist) {
      return res
        .status(HttpStatus.UNAUTHORIZED_EXCEPTION)
        .send({ message: "Unauthorized" });
    }

    req.user = user;
    return next();
  })(req, res, next);
};
