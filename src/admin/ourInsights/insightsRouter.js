import express from "express";
import asyncWrap from "express-async-wrapper";
import InsightsController from "./insightsController";
import storeFiles from "../../common/middlewares/store-files";

const routes = express.Router();

routes.get('/', asyncWrap(InsightsController.listingInsightsPage));
routes.get('/listingInsights', asyncWrap(InsightsController.listingInsights));

routes.get('/addInsightPage', asyncWrap(InsightsController.addInsightsPage));
routes.post('/addInsightPage', storeFiles('public/ourInsights', 'image', 'single'), asyncWrap(InsightsController.insightsAdd));

routes.get('/delete/:id', asyncWrap(InsightsController.insightsDelete));

routes.get('/updatePage/:id', asyncWrap(InsightsController.updateInsightPage))
routes.post('/updateInsights', storeFiles('public/ourInsights', 'image', 'single'), asyncWrap(InsightsController.updateInsights))

module.exports = routes;