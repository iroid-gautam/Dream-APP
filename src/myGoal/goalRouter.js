import express from "express";
import asyncWrap from "express-async-wrapper";
import GoalController from "./goalController";
import storeFiles from "../common/middlewares/store-files";

import validator from "../common/config/joi-validator";
import addGoalDtos from "./Dto/addGoalDtos";

const routes = express.Router();

routes.post('/searchGoal', asyncWrap(GoalController.searchGoal));
routes.get('/progressComplete', asyncWrap(GoalController.goalProgressCompleted));

routes.post('/', storeFiles('public/goalImage', 'image', 'single'), asyncWrap(GoalController.addGoal));
routes.get('/:id', asyncWrap(GoalController.getSingleGoal));
routes.delete('/:id', asyncWrap(GoalController.deleteGoal));

routes.post('/markAsDone/:id', asyncWrap(GoalController.markAsDoneGoal));

module.exports = routes;