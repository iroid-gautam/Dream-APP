import express from "express";
import asyncWrap from "express-async-wrapper";
import CubZoneController from "./cubZoneController";
import storeFiles from "../../common/middlewares/store-files";

const routes = express.Router();

routes.get('/', asyncWrap(CubZoneController.cubzonelistingPage));
routes.get('/listing', asyncWrap(CubZoneController.getCubZoneListing));

routes.get('/add', asyncWrap(CubZoneController.cubZoneAddPage));
routes.post('/add', storeFiles('public/cubzone', { first: 'frontImage', second: 'flipImage' }, 'fields'), asyncWrap(CubZoneController.addCubZone));

routes.get('/delete/:id', asyncWrap(CubZoneController.deleteCunZone));

module.exports = routes;