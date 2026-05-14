import "dotenv/config";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "../../../model/user";
import AuthService from "../../auth/authService";
import { AUTH_PROVIDER } from "../constants/constant";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "missing-google-client-id",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || "missing-google-client-secret",
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:9001/api/v1/auth/social/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await AuthService.findOrCreateSocialUser({
          provider: AUTH_PROVIDER.GOOGLE,
          profile,
        });

        user.oauthProvider = AUTH_PROVIDER.GOOGLE;
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID || "missing-facebook-app-id",
      clientSecret:
        process.env.FACEBOOK_APP_SECRET || "missing-facebook-app-secret",
      callbackURL:
        process.env.FACEBOOK_CALLBACK_URL ||
        "http://localhost:9001/api/v1/auth/social/facebook/callback",
      profileFields: ["id", "displayName", "emails"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await AuthService.findOrCreateSocialUser({
          provider: AUTH_PROVIDER.FACEBOOK,
          profile,
        });

        user.oauthProvider = AUTH_PROVIDER.FACEBOOK;
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
