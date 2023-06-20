import express from "express";
import { logo } from "../src/common/helper";
import resetPasswordRoutes from "../src/resetPassword/reset-password.routes";

const router = express.Router();

router.get("/changelogs", (req, res) => {
  return res.render("api/changelog", { logo: logo() });
});
router.use("/reset-password", resetPasswordRoutes);

// router.get("/reset-password", (req, res) => {
//   return res.render("email_templates/reset-password-mail", { logo: logo() });
// });

// router.get("/reset-password", (req, res) => {
//   return res.render("resetPassword/index", { logo: logo() });
// });

// router.post("/reset-password", (req, res) => {
//   return res.render("resetPassword/index", { logo: logo() });
// });
module.exports = router;