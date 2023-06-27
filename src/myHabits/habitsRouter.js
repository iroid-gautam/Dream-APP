import express from "express";
import asyncWrap from "express-async-wrapper";
import HabitsController from "./habitsController";

const routes = express.Router();

routes.get('/listing', asyncWrap(HabitsController.habitsListing));

routes.post('/', asyncWrap(HabitsController.addHabits));
routes.get('/:id', asyncWrap(HabitsController.getSingleHabit));
routes.post('/markAsDone/:id', asyncWrap(HabitsController.markAsDoneHabit));
routes.delete('/:id', asyncWrap(HabitsController.deleteHabits));

module.exports = routes;