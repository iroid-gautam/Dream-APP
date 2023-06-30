import express from "express";
import asyncWrap from "express-async-wrapper";
import JournalController from "./journalController";
import storeFiles from "../common/middlewares/store-files";

const routes = express.Router();

routes.post('/', storeFiles('public/myJournal', 'image', 'single'), asyncWrap(JournalController.addJournal));
routes.get('/', asyncWrap(JournalController.getAllJournalListing));

module.exports = routes;