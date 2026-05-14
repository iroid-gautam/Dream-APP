import express from "express";
import asyncWrapper from "express-async-wrapper";
import DeviceTokenController from "./deviceTokenController";
import authenticate from "../common/middlewares/authenticate";
import validator from "../common/config/joi-validator";
import registerDeviceTokenDto from "./dtos/registerDeviceToken.dto";
import removeDeviceTokenDto from "./dtos/removeDeviceToken.dto";

const router = express.Router();

router.post(
  "/",
  authenticate,
  validator.body(registerDeviceTokenDto),
  asyncWrapper(DeviceTokenController.register)
);

router.delete(
  "/",
  authenticate,
  validator.body(removeDeviceTokenDto),
  asyncWrapper(DeviceTokenController.remove)
);

export default router;
