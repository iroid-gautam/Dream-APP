import express from "express";
import asyncWrap from "express-async-wrapper";
import MyController from "./myController";

const routes = express.Router();

routes.get('/mindBody', asyncWrap(MyController.getMyMindBody));
routes.get('/inspiration', asyncWrap(MyController.getMyInspiration));

module.exports = routes;