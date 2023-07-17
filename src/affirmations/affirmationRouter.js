import express from "express";
import asyncWrap from "express-async-wrapper";
import AffirmationController from "./affirmationController";

const routes = express.Router();

routes.get('/', asyncWrap(AffirmationController.affirmationsListing));

module.exports = routes;