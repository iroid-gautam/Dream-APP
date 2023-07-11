import express from "express";
import asyncWrap from "express-async-wrapper";
import VideoPodcastController from "./videoPodcastController";
import storeFiles from "../../common/middlewares/store-files";

const routes = express.Router();

routes.get('/', asyncWrap(VideoPodcastController.listingVideoOrPodcast));
routes.get('/listing', asyncWrap(VideoPodcastController.getListingVideosOrPodcast));

routes.get('/addPage', asyncWrap(VideoPodcastController.addVideoPodcastPage));
routes.post('/addPage', storeFiles('public/videoPodcast', 'videopodcast', 'single'), asyncWrap(VideoPodcastController.addedVideoPodcasts));

routes.get('/deleteVP/:id', asyncWrap(VideoPodcastController.deleteVideoPodcasts));

routes.get('/updatePage/:id', asyncWrap(VideoPodcastController.updateVideoOrPodcastPage))

module.exports = routes;