import VideoPodcasts from "../../../model/videoAndPodcasts";
import commonService from "../../../utils/commonServices";

import path from "path";
import fs from "fs"

class VideoPodcastServices {

    /**
     * @description: Listing VideoOrPodcast
     * @param {*} req 
     * @param {*} res 
     */
    static async listingVideoOrPodcast(req, res) {
        return res.render('admin/videoAndPodcasts/listingVideoPodcast')
    }




    /**
     * @description: Get video podcast listing
     * @param {*} query 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async getListingVideosOrPodcast(query, req, res) {
        const { start, length, search, draw } = query;
        const page = parseInt(start) || 0;
        const limit = parseInt(length) || 10;

        const search_value = search.value;
        const search_query = {
            $or: [{ "title": { $regex: search_value, $options: 'i' } }, { "description": { $regex: search_value, $options: 'i' } },]
        };

        const data = await VideoPodcasts.find(search_value ? search_query : {}).skip(page).limit(limit).sort({ 'createdAt': -1 });
        const count = await commonService.totalDocuments(VideoPodcasts, data);

        return res.send({
            draw: draw,
            iTotalRecords: count,
            iTotalDisplayRecords: count,
            aaData: data
        });
    }


    /**
     * @description: Add video & podcasts page
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async addVideoPodcastPage(req, res) {
        return res.render('admin/videoAndPodcasts/addVideoPod');
    }




    /**
     * @description: Added video and podcast
     * @param {*} data 
     * @param {*} files 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async addedVideoPodcasts(data, file, req, res) {
        // const { thumbnail, videopodcast } = file;
        try {
            // const thumbnails = `videoPodcast/${thumbnail[0].filename}`;
            // const videoPodcast = `videoPodcast/${videopodcast[0].filename}`;

            const videoPodcast = `videoPodcast/${file.filename}`;

            // data.thumbnail = thumbnails
            data.videoPodcast = videoPodcast

            const storeVideoPod = await commonService.createOne(VideoPodcasts, data);

            req.flash('success', 'Video & Podcast added successfully');
            return res.redirect('/admin/videopodcasts');
        } catch (err) {
            console.log(err);
            req.flash('error', 'Something went wrong');
            return res.redirect('back');
        }
    }



    /**
     * @description: Delete video and podcasts
     * @param {*} id 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async deleteVideoPodcasts(id, req, res) {
        const deleteVPById = await commonService.deleteById(VideoPodcasts, { _id: id });
        if (!deleteVPById) {
            return res.redirect('back');
        } else {
            try {
                await fs.unlinkSync(path.join(__dirname, '../../../public/', deleteVPById.videoPodcast));
                return res.redirect('back');
            } catch (err) {
                return res.redirect('back');
            }
        }
    }




    /**
     * @description: Update page
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async updateVideoOrPodcastPage(id, req, res) {
        const findVP = await commonService.findById(VideoPodcasts, { _id: id })
        return res.render('admin/videoAndPodcasts/updateVideoPod', {
            "vidPod": findVP
        });
    }



    static async updateVideoOrPodcasts(data, file, req, res) {

    }
}

export default VideoPodcastServices;