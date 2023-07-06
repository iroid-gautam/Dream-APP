import express from "express";
import asyncWrap from "express-async-wrapper";
import InsightsController from "./insightsController";

const routes = express.Router();

routes.get('/', asyncWrap(InsightsController.allInsightsListing));
routes.get('/:id', asyncWrap(InsightsController.getSingleInsightsDetails));

module.exports = routes;