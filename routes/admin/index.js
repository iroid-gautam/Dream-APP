import express from "express";
import authentication from "../../src/admin/middleware/authentication";

const router = express.Router();

router.use('/', require('../../src/admin/auth/authRouter'))
router.use('/dashboard', authentication, require('../../src/admin/dashboard/dashboardRouter'));
router.use('/user', authentication, require('../../src/admin/users/usersRouter'));

module.exports = router;