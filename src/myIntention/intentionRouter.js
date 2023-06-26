import express from "express";
import asyncWrap from "express-async-wrapper";
import IntentionController from "./intentionController";

const routes = express.Router();

import validator from "../common/config/joi-validator";
import addIntentionDtos from "./Dtos/addIntentionDtos";

routes.post('/', validator.body(addIntentionDtos), asyncWrap(IntentionController.intentionAdd));
routes.get('/', asyncWrap(IntentionController.getIntention));

module.exports = routes;