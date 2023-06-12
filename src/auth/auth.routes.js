import express from "express";
import AuthController from "./authController";
import asyncWrapper from "express-async-wrapper";
import registerUserDto from "./dtos/registerUser.dto";
import validator from "../common/config/joi-validator";
import storeFiles from "../common/middlewares/store-files";
import authenticate from "../common/middlewares/authenticate";
const router = express.Router();

router.post("/register", 
    storeFiles("media/users", "profileImage", "single"),
    validator.body(registerUserDto),
    asyncWrapper(AuthController.register)
);

router.post("/verify-otp", 
    asyncWrapper(AuthController.verifyOtp)
);


router.post("/resend-otp", asyncWrapper(AuthController.resendOtp));

router.post("/login", asyncWrapper(AuthController.login));

router.post("/logout", authenticate,asyncWrapper(AuthController.logOut));


export default router;