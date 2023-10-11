import express from "express";
import authentication from "../../src/admin/middleware/authentication";

const router = express.Router();

router.use('/', require('../../src/admin/auth/authRouter'))
router.use('/dashboard', authentication, require('../../src/admin/dashboard/dashboardRouter'));
router.use('/user', authentication, require('../../src/admin/users/usersRouter'));

router.use('/ourinsights', authentication, require('../../src/admin/ourInsights/insightsRouter'));
router.use('/videopodcasts', authentication, require('../../src/admin/videoAndPodcasts/videoPodcastRouter'));

router.use('/inspirational', authentication, require('../../src/admin/inspirationalQuotes/inspirationalRouter'));
router.use('/affirmation', authentication, require('../../src/admin/affirmations/affirmationsRouter'));
router.use('/questions', authentication, require('../../src/admin/questionsToContemplate/questionsRouter'));
router.use('/strategy', authentication, require('../../src/admin/strategy/strategyRouter'));
router.use('/cubzone', authentication, require('../../src/admin/cubZone/cubZoneRouter'));

router.use('/changePassword', authentication, require('../../src/admin/changePassword/changeRouter'));

router.use('/forgotPassword', require('../../src/admin/forgotPassword/forgotRouter'));

module.exports = router;