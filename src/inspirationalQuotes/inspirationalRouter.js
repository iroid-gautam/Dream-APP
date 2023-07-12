import express from "express";
import asyncWrap from "express-async-wrapper";
import InspirationalController from "./inspirationalController";

const routes = express.Router();

routes.get('/', asyncWrap(InspirationalController.inspirationalListing));

module.exports = routes;