import express from "express";
import asyncWrap from "express-async-wrapper";
import InspirationalController from "./inspirationalController";
import storeFiles from "../../common/middlewares/store-files";

const routes = express.Router();

routes.get('/', asyncWrap(InspirationalController.listingInspirationPage));
routes.get('/listing', asyncWrap(InspirationalController.getListingInspirational));

routes.get('/add', asyncWrap(InspirationalController.addInspirationPage));
routes.post('/add', storeFiles('public/inspirational', { first: 'frontImage', second: 'flipImage' }, 'fields'), asyncWrap(InspirationalController.addInspiration));

routes.use('/delete/:id', asyncWrap(InspirationalController.deleteInspirational));

module.exports = routes;