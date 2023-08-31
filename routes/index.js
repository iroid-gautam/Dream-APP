import express from "express";
import apiRoutes from "./api";
import webRoutes from "./web";
import adminRoutes from "./admin/index"

const router = express.Router();

router.use('/admin', adminRoutes);
router.use("/api/v1", apiRoutes);

router.use("/", webRoutes);


router.get("/admin", (req, res) => {
    return res.redirect('/admin/login')
});

export default router;
