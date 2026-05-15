import passport from "passport";
import { ExtractJwt, Strategy as JWTstratagy } from "passport-jwt";
import { JWT } from "../constants/constant";
import User from "../../../model/user";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT.SECRET,
};

passport.use(
  new JWTstratagy(options, async (jwtPayload, done) => {
    try {
      const user = await User.findByPk(jwtPayload.id);

      if (!user) {
        return done(null, false);
      }

      const sanitizedUser = user.toJSON();

      return done(null, { ...sanitizedUser, jti: jwtPayload.jti });
    } catch (error) {
      return done(error, false);
    }
  })
);
