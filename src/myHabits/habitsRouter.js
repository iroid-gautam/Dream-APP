import express from "express";
import asyncWrap from "express-async-wrapper";
import HabitsController from "./habitsController";

const routes = express.Router();

routes.get('/listing', asyncWrap(HabitsController.habitsListing));
routes.post('/searchHabit', asyncWrap(HabitsController.searchHabitFilter));

routes.post('/', asyncWrap(HabitsController.addHabits));
routes.get('/:id', asyncWrap(HabitsController.getSingleHabit));
routes.delete('/:id', asyncWrap(HabitsController.deleteHabits));
routes.put('/:id', asyncWrap(HabitsController.editHabit));
routes.post('/markAsDone/:id', asyncWrap(HabitsController.markAsDoneHabit));

module.exports = routes;