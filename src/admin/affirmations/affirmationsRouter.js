import express from "express";
import asyncWrap from "express-async-wrapper";
import AffirmationController from "./affirmationsController";
import storeFiles from "../../common/middlewares/store-files";

const routes = express.Router();

routes.get('/', asyncWrap(AffirmationController.listingAffirmationsPage));
routes.get('/listing', asyncWrap(AffirmationController.getListingAffirmations));

routes.get('/add', asyncWrap(AffirmationController.addAffirmationsPage));
routes.post('/add', storeFiles('public/affirmations', { first: 'frontImage', second: 'flipImage' }, 'fields'), asyncWrap(AffirmationController.addAffirmations));

routes.get('/delete/:id', asyncWrap(AffirmationController.deleteAffirmations));

module.exports = routes;