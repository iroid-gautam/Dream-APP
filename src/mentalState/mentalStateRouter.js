import express from "express";
import asyncWrap from "express-async-wrapper";
import MentalStateController from "./mentalStateController";

const routes = express.Router();

routes.get('/emojis', asyncWrap(MentalStateController.emojiListing));

routes.post('/addScore', asyncWrap(MentalStateController.addMentalScore));

routes.get('/', asyncWrap(MentalStateController.getMentalScore));

routes.get('/overAllScore', asyncWrap(MentalStateController.overAllScoreFind));

module.exports = routes;