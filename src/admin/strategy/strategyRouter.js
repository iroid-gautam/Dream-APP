import express from "express";
import asyncWrap from "express-async-wrapper";
import StrategyController from "./strategyController";
import storeFiles from "../../common/middlewares/store-files";

const routes = express.Router();

routes.get('/', asyncWrap(StrategyController.listingStrategyPage));
routes.get('/listing', asyncWrap(StrategyController.getListingStrategy));

routes.get('/add', asyncWrap(StrategyController.addStrategyPage));
routes.post('/add', storeFiles('public/strategy', { first: 'frontImage', second: 'flipImage' }, 'fields'), asyncWrap(StrategyController.addStrategy));

routes.get('/delete/:id', asyncWrap(StrategyController.deleteStrategy));

routes.get('/editStrategy/:id', asyncWrap(StrategyController.editStrategyPage));
routes.post('/editStrategy/:id', storeFiles('public/strategy', { first: 'frontImage', second: 'flipImage' }, 'fields'), asyncWrap(StrategyController.editStrategy));

module.exports = routes;