import express from "express";
import authentication from "../../src/admin/middleware/authentication";

const router = express.Router();

router.use('/', require('../../src/admin/auth/authRouter'))
router.use('/dashboard', authentication, require('../../src/admin/dashboard/dashboardRouter'));
router.use('/user', authentication, require('../../src/admin/users/usersRouter'));

router.use('/ourinsights', authentication, require('../../src/admin/ourInsights/insightsRouter'));
router.use('/videopodcasts', authentication, require('../../src/admin/videoAndPodcasts/videoPodcastRouter'));

module.exports = router;