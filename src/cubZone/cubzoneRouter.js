import express from "express";
import asyncWrap from "express-async-wrapper";
import CubZoneController from "./cubzoneController";

const routes = express.Router();

routes.get('/', asyncWrap(CubZoneController.cunZoneListing));

module.exports = routes;