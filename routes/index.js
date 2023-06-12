import express from "express";
import apiRoutes from "./api";
import webRoutes from "./web";

const router = express.Router();

router.use("/api/v1", apiRoutes);

router.use("/", webRoutes);

export default router;
