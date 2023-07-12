import express from "express";
import asyncWrap from "express-async-wrapper";
import VideoOrPodcastsController from "./videoPodController";

const routes = express.Router();

routes.get('/', asyncWrap(VideoOrPodcastsController.videoAndPodcastsListing));
routes.get('/:id', asyncWrap(VideoOrPodcastsController.getSingleVideoPodcasts));

module.exports = routes;