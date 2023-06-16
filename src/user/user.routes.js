import express from "express";
import asyncWrapper from "express-async-wrapper";
import UserController from "./user.controller";

const router = express.Router();

router.get("/", asyncWrapper(UserController.index));
router.put("/", asyncWrapper(UserController.update));

module.exports = router;