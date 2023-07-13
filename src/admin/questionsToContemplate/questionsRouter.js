import express from "express";
import asyncWrap from "express-async-wrapper";
import QuestionsToContemplateController from "./questionsController";
import storeFiles from "../../common/middlewares/store-files";

const routes = express.Router();

routes.get('/', asyncWrap(QuestionsToContemplateController.questionsListingPage));
routes.get('/listing', asyncWrap(QuestionsToContemplateController.getListingQuestions));

routes.get('/add', asyncWrap(QuestionsToContemplateController.addQuestionsPage));
routes.post('/add', storeFiles('public/questions', { first: 'frontImage', second: 'flipImage' }, 'fields'), asyncWrap(QuestionsToContemplateController.addQuestionsContemplate));

routes.get('/delete/:id', asyncWrap(QuestionsToContemplateController.deleteQuestions));

module.exports = routes;