import VideoOrPodcastsServices from "./videoPodServices";



class VideoOrPodcastsController {
    /**
     * @description: Get all videos and podcasts
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async videoAndPodcastsListing(req, res) {
        const { data, meta } = await VideoOrPodcastsServices.videoAndPodcastsListing(req.query, req, res);
        return res.send({ data: data, meta: meta })
    }



    /**
     * @description: Get single video & podcasts
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async getSingleVideoPodcasts(req, res) {
        const data = await VideoOrPodcastsServices.getSingleVideoPodcasts(req.params.id, req, res);
        return res.send({ data: data });
    }
}

export default VideoOrPodcastsController;