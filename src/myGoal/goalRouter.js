import express from "express";
import asyncWrap from "express-async-wrapper";
import GoalController from "./goalController";
import storeFiles from "../common/middlewares/store-files";

const routes = express.Router();

routes.post('/', storeFiles('public/goalImage', 'image', 'single'), asyncWrap(GoalController.addGoal));

module.exports = routes;