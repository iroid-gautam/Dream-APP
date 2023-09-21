import path from "path";
import fs from "fs";
import Strategy from "../../../model/strategy";
import commonService from "../../../utils/commonServices";
import VideoPodcasts from "../../../model/videoAndPodcasts";

class StrategyServices {
    /**
     * @description: Listing page
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async listingStrategyPage(req, res) {
        return res.render('admin/strategy/listing');
    }



    /**
     * @description: Get listing strategy
     * @param {*} query 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async getListingStrategy(query, req, res) {
        const { start, length, search, draw } = query;
        const page = parseInt(start) || 0;
        const limit = parseInt(length) || 10;

        const search_value = search.value;
        const search_query = {
            $or: [{ "type": { $regex: search_value, $options: 'i' } },]
        };

        const data = await Strategy.find(search_value ? search_query : {}).skip(page).limit(limit).sort({ 'createdAt': -1 });
        const count = await commonService.totalDocuments(Strategy, data);

        const total_records_with_filter = await commonService.totalDocuments(Strategy, search_query);

        return res.send({
            draw: draw,
            iTotalRecords: count,
            iTotalDisplayRecords: total_records_with_filter,
            aaData: data
        });
    }



    /**
     * @description: add page
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async addStrategyPage(req, res) {
        const videos = await VideoPodcasts.find({ type: '1' });
        return res.render('admin/strategy/addStrategy', { 'videos': videos });
    }



    /**
     * @description: Add strategy
     * @param {*} data 
     * @param {*} files 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async addStrategy(data, files, req, res) {
        const { frontImage, flipImage } = files;

        const front = `strategy/${frontImage[0].filename}`;
        const flip = `strategy/${flipImage[0].filename}`;

        data.frontImage = front
        data.flipImage = flip
        data.videoRef = data.videoRef ? data.videoRef : null

        const storeInspiration = await commonService.createOne(Strategy, data);

        req.flash('success', 'Strategy added successfully');
        return res.redirect('/admin/strategy');
    }



    /**
     * @description: Delete Strategy
     * @param {*} id 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async deleteStrategy(id, req, res) {
        const deleteStrategyById = await commonService.deleteById(Strategy, { _id: id });
        if (!deleteStrategyById) {
            return res.redirect('back');
        } else {
            try {
                await fs.unlinkSync(path.join(__dirname, '../../../public/', deleteStrategyById.frontImage));
                await fs.unlinkSync(path.join(__dirname, '../../../public/', deleteStrategyById.flipImage));
                return res.redirect('back');
            } catch (err) {
                return res.redirect('back');
            }
        }
    }



    /**
     * @description: Statery update page
     * @param {*} id 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async editStrategyPage(id, req, res) {
        const findId = await Strategy.findById({ _id: id });
        const videos = await VideoPodcasts.find({ type: '1' });
        return res.render('admin/strategy/editStrategy', { 'videos': videos, 'strategy': findId });
    }




    /**
     * @description: Edit strategy
     * @param {*} data 
     * @param {*} files 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async editStrategy(data, files, req, res) {
        const { updateId } = data;
        const { frontImage, flipImage } = files;

        if (frontImage || flipImage) {
            const findStrategy = await Strategy.findById(updateId);

            const frontImageUp = frontImage ? `strategy/${frontImage[0].filename}` : findStrategy.frontImage;
            const flipImageUp = flipImage ? `strategy/${flipImage[0].filename}` : findStrategy.flipImage;
            try {
                frontImage ? await fs.unlinkSync(path.join(__dirname, '../../../public/', findStrategy.frontImage)) : findStrategy.frontImage
                flipImage ? await fs.unlinkSync(path.join(__dirname, '../../../public/', findStrategy.flipImage)) : findStrategy.flipImage
            } catch (err) {
                await Strategy.findByIdAndUpdate(updateId, {
                    frontImage: frontImageUp,
                    flipImage: flipImageUp
                }, { new: true })
            }

            data.frontImage = frontImageUp
            data.flipImage = flipImageUp

            await Strategy.findByIdAndUpdate(updateId, data);

            req.flash('success', 'Strategy updated successfully');
            return res.redirect('/admin/strategy');

        } else {
            await Strategy.findByIdAndUpdate(updateId, data);

            req.flash('success', 'Strategy updated successfully');
            return res.redirect('/admin/strategy');
        }

    }
}

export default StrategyServices;