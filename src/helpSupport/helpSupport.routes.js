import express from "express";
import asyncWrapper from "express-async-wrapper";
import HelpSupportController from "./helpSupportController";
import authenticate from "../common/middlewares/authenticate";
import validator from "../common/config/joi-validator";
import createHelpSupportDto from "./dtos/createHelpSupport.dto";

const router = express.Router();

router.post(
  "/",
  authenticate,
  validator.body(createHelpSupportDto),
  asyncWrapper(HelpSupportController.create)
);

export default router;
