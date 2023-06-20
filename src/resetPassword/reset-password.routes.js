import express from "express";
import resetPasswordController from "./reset-password.controller";

const router = express.Router();

router.get("/", resetPasswordController.resetPasswordGet);
router.post("/", resetPasswordController.resetPasswordPost);

module.exports = router;