import express from "express";
import asyncWrap from "express-async-wrapper";
import usersController from "./usersController";

const routes = express.Router();

routes.get('/', asyncWrap(usersController.usersPage));
routes.get('/viewUser', asyncWrap(usersController.viewUsers));

module.exports = routes;