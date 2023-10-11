import express from "express";
import asyncWrap from "express-async-wrapper";
import forgotController from "./forgotController";

const routes = express.Router();

routes
    .get('/', asyncWrap(forgotController.forgotPage))
    .post('/', asyncWrap(forgotController.resetPasswordLinkGenerate))


    .get('/forgotPage/:token', asyncWrap(forgotController.forgotPasswordPage))
    .post('/forgotPage/:token', asyncWrap(forgotController.resetPassword))

module.exports = routes;