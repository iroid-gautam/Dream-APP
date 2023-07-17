import express from "express";
import asyncWrap from "express-async-wrapper";
import QuestionsController from "./questionsController";

const routes = express.Router();

routes.get('/', asyncWrap(QuestionsController.questionsToContemplateListing));

module.exports = routes;