import VideoPodcastServices from "./videoPodcastServices";

class VideoPodcastController {
    /**
     * @description: Listing video or podcast
     * @param {*} req 
     * @param {*} res 
     */
    static async listingVideoOrPodcast(req, res) {
        await VideoPodcastServices.listingVideoOrPodcast(req, res);
    }



    /**
     * @description: Listing get videos and podcast
     * @param {*} req 
     * @param {*} res 
     */
    static async getListingVideosOrPodcast(req, res) {
        await VideoPodcastServices.getListingVideosOrPodcast(req.query, req, res);
    }



    /**
     * @description: Add video & podcasts page
     * @param {*} req 
     * @param {*} res 
     */
    static async addVideoPodcastPage(req, res) {
        await VideoPodcastServices.addVideoPodcastPage(req, res);
    }



    /**
     * @description: Added in database
     * @param {*} req 
     * @param {*} res 
     */
    static async addedVideoPodcasts(req, res) {
        await VideoPodcastServices.addedVideoPodcasts(req.body, req.file, req, res);
    }



    /**
     * @description: Delete Video or Podcasts
     * @param {*} req 
     * @param {*} res 
     */
    static async deleteVideoPodcasts(req, res) {
        await VideoPodcastServices.deleteVideoPodcasts(req.params.id, req, res);
    }




    /**
     * @description: update video or podcast
     * @param {*} req 
     * @param {*} res 
     */
    static async updateVideoOrPodcastPage(req, res) {
        await VideoPodcastServices.updateVideoOrPodcastPage(req.params.id, req, res);
    }



    /**
     * @description: Update video or podcasts
     * @param {*} req 
     * @param {*} res 
     */
    static async updateVideoOrPodcasts(req, res) {
        await VideoPodcastServices.updateVideoOrPodcasts(req.body, req.file, req, res);
    }
}

export default VideoPodcastController;