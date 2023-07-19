import express from "express";
import asyncWrap from "express-async-wrapper";
import AllCardsListingController from "./allCardsListingController";

const routes = express.Router();

routes.get('/', asyncWrap(AllCardsListingController.allCardsListing));
routes.post('/flipCard/:id', asyncWrap(AllCardsListingController.flippedCardsAdd));

module.exports = routes;