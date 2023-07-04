import express from "express";
import asyncWrap from "express-async-wrapper";
import dashboardController from "./dashboardController";

const routes = express.Router();

routes.get('/', asyncWrap(dashboardController.dashboard));

module.exports = routes;