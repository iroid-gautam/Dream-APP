import VideoPodcasts from "../../model/videoAndPodcasts";
import commonService from "../../utils/commonServices";
import { BadRequestException, NotFoundException } from "../common/error-exceptions";
import VideoPodcastsResource from "./resources/listingVideoPodcastsResource";
import SingleVPResource from "./resources/singleVPResources";
import mongoose from "mongoose";

class VideoOrPodcastsServices {
    /**
     * @description: Listing of video and podcasts
     * @param {*} query 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async videoAndPodcastsListing(query, req, res) {
        const page = parseInt(query.page) - 1 || 0;
        const pageLimit = parseInt(query.limit) || 20;

        const findVP = await VideoPodcasts.find({ type: query.type }).skip(page * pageLimit).limit(pageLimit).sort({ createdAt: -1 });

        const totalDocument = await commonService.totalDocuments(VideoPodcasts, { type: query.type });

        const meta = {
            total: totalDocument,
            perPage: pageLimit,
            currentPage: page + 1,
            lastPage: Math.ceil(totalDocument / pageLimit),
        }

        return { data: new VideoPodcastsResource(findVP), meta: meta }
    }




    /**
     * @description: Get single video or podcasts details
     * @param {*} id 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async getSingleVideoPodcasts(id, req, res) {
        console.log(id);
        if (mongoose.Types.ObjectId.isValid(id)) {
            const findVideoPodcasts = await commonService.findById(VideoPodcasts, { _id: id });
            if (findVideoPodcasts) {
                return { ...new SingleVPResource(findVideoPodcasts) };
            } else {
                throw new NotFoundException("This video & podcasts id not found")
            }
        } else {
            throw new BadRequestException("Please provide correct video & podcasts id");
        }
    }
}

export default VideoOrPodcastsServices;