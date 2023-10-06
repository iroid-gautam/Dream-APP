import express from "express";
import asyncWrap from "express-async-wrapper";
import changePasswordController from "./changeController";

const routes = express.Router();

routes
    .get('/', asyncWrap(changePasswordController.changePassPage))
    .post('/', asyncWrap(changePasswordController.changePassword))

module.exports = routes;