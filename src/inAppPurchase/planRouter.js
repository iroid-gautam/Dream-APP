import express from "express";
import asyncWrap from "express-async-wrapper";
import PlanController from "./planController";

const router = express.Router();

router.post('/', asyncWrap(PlanController.purchaseSubscription));

router.get('/', asyncWrap(PlanController.getSubscription));

module.exports = router;