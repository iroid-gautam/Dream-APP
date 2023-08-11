import express from "express";
import asyncWrapper from "express-async-wrapper";
import UserController from "./user.controller";
import storeFiles from "../common/middlewares/store-files";

const router = express.Router();

router.get("/", asyncWrapper(UserController.index));
router.put("/", asyncWrapper(UserController.update));

router.post('/email-change', asyncWrapper(UserController.emailChange));
router.post('/verify-email-otp', asyncWrapper(UserController.emailVerifyOTP));

router.put('/updatePicture', storeFiles("media/users", "profileImage", "single"), asyncWrapper(UserController.userProfilePictureUpdate));

router.post("/changePassword", asyncWrapper(UserController.changePassword));

module.exports = router;