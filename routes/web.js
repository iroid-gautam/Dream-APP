import express from "express";
import asyncWrap from "express-async-wrapper";
import webController from "./web/webController";
import { logo } from "../src/common/helper";
import resetPasswordRoutes from "../src/resetPassword/reset-password.routes";

const router = express.Router();

router.get("/changelogs", (req, res) => {
  return res.render("api/changelog", { logo: logo() });
});
router.use("/reset-password", resetPasswordRoutes);

router.get('/terms-condition', asyncWrap(webController.termsCondition))
router.get('/privacy-policy', asyncWrap(webController.privacyPolicy))

module.exports = router;