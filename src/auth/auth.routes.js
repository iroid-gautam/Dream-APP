import express from "express";
import asyncWrapper from "express-async-wrapper";
import AuthController from "./authController";
import validator from "../common/config/joi-validator";
import authenticate from "../common/middlewares/authenticate";
import registerUserDto from "./dtos/registerUser.dto";
import loginDto from "./dtos/login.dto";
import verifyOtpDto from "./dtos/verifyOtp.dto";
import resendOtpDto from "./dtos/resendOtp.dto";
import forgotPasswordDto from "./dtos/forgotPassword.dto";
import resetPasswordDto from "./dtos/resetPassword.dto";
import changePasswordDto from "./dtos/changePassword.dto";
import updateProfileDto from "./dtos/updateProfile.dto";
import verifyEmailUpdateDto from "./dtos/verifyEmailUpdate.dto";

const router = express.Router();

router.post(
  "/register",
  validator.body(registerUserDto),
  asyncWrapper(AuthController.register)
);

router.post(
  "/verify-otp",
  validator.body(verifyOtpDto),
  asyncWrapper(AuthController.verifyOtp)
);

router.post(
  "/resend-otp",
  validator.body(resendOtpDto),
  asyncWrapper(AuthController.resendOtp)
);

router.post(
  "/login",
  validator.body(loginDto),
  asyncWrapper(AuthController.login)
);

router.post(
  "/refreshToken",
  asyncWrapper(AuthController.refreshTokenToGenerateAccessToken)
);

router.post("/logout", authenticate, asyncWrapper(AuthController.logOut));

router.post(
  "/forgot-password",
  validator.body(forgotPasswordDto),
  asyncWrapper(AuthController.forgotPassword)
);

router.post(
  "/reset-password",
  validator.body(resetPasswordDto),
  asyncWrapper(AuthController.resetPassword)
);

router.post(
  "/change-password",
  authenticate,
  validator.body(changePasswordDto),
  asyncWrapper(AuthController.changePassword)
);

router.patch(
  "/update-profile",
  authenticate,
  validator.body(updateProfileDto),
  asyncWrapper(AuthController.updateProfile)
);

router.post(
  "/verify-email-update",
  authenticate,
  validator.body(verifyEmailUpdateDto),
  asyncWrapper(AuthController.verifyEmailUpdate)
);

router.post(
  "/resend-email-update-otp",
  authenticate,
  asyncWrapper(AuthController.resendEmailUpdateOtp)
);

router.delete(
  "/delete-account",
  authenticate,
  asyncWrapper(AuthController.deleteAccount)
);

router.get("/social/:provider", AuthController.socialAuthStart);

router.get(
  "/social/:provider/callback",
  AuthController.socialAuthCallback,
  asyncWrapper(AuthController.oauthCallback)
);

router.get("/me", authenticate, asyncWrapper(AuthController.me));

export default router;
