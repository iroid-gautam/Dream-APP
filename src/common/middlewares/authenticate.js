// jwt AUTHENTICATION
import AccessToken from "../../../model/accessToken";
import { HttpStatus } from "../error-exceptions";
import passport from "passport";

export default (req, res, next) => {
  passport.authenticate("jwt", { session: false }, async (err, user) => {
    if (!user) {
      return res
        .status(HttpStatus.UNAUTHORIZED_EXCEPTION)
        .send({ message: "Unauthorized" });
    }

    const exist = await AccessToken.findOne({
      token: user.jti,
      isRevoked: false,
      userId: user._id,
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
