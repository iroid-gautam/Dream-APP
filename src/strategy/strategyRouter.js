import express from "express";
import asyncWrap from "express-async-wrapper";
import StrategyController from "./strategyController";

const routes = express.Router();

routes.get('/', asyncWrap(StrategyController.startegyListing));

module.exports = routes;