import path from "path";
import fs from "fs";
import Inspirational from "../../../model/inspirational";
import commonService from "../../../utils/commonServices";

class InspirationalServices {
    /**
     * @description: listing inspiratinal
     * @param {*} req 
     * @param {*} res 
     */
    static async listingInspirationPage(req, res) {
        return res.render('admin/inspirationalQuotes/listing');
    }



    /**
     * @description: Get listing
     * @param {*} query 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async getListingInspirational(query, req, res) {
        const { start, length, search, draw } = query;
        const page = parseInt(start) || 0;
        const limit = parseInt(length) || 10;

        const search_value = search.value;
        const search_query = {
            $or: [{ "type": { $regex: search_value, $options: 'i' } },]
        };

        const data = await Inspirational.find(search_value ? search_query : {}).skip(page).limit(limit).sort({ 'createdAt': -1 });
        const count = await commonService.totalDocuments(Inspirational, data);

        const total_records_with_filter = await commonService.totalDocuments(Inspirational, search_query);

        return res.send({
            draw: draw,
            iTotalRecords: count,
            iTotalDisplayRecords: total_records_with_filter,
            aaData: data
        });
    }



    /**
     * @description: Add inspirational page
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async addInspirationPage(req, res) {
        return res.render('admin/inspirationalQuotes/addInspirational');
    }



    /**
     * @description: Add inspirational qoutes
     * @param {*} data 
     * @param {*} files 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async addInspiration(data, files, req, res) {

        const { frontImage, flipImage } = files;

        const front = `inspirational/${frontImage[0].filename}`;
        const flip = `inspirational/${flipImage[0].filename}`;

        data.frontImage = front
        data.flipImage = flip

        const storeInspiration = await commonService.createOne(Inspirational, data);

        req.flash('success', 'Inspirational qoutes added successfully');
        return res.redirect('/admin/inspirational');
    }



    /**
     * @description: Delete inspirational
     * @param {*} id 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async deleteInspirational(id, req, res) {
        const deleteInspirationalById = await commonService.deleteById(Inspirational, { _id: id });
        if (!deleteInspirationalById) {
            return res.redirect('back');
        } else {
            try {
                await fs.unlinkSync(path.join(__dirname, '../../../public/', deleteInspirationalById.frontImage));
                await fs.unlinkSync(path.join(__dirname, '../../../public/', deleteInspirationalById.flipImage));
                return res.redirect('back');
            } catch (err) {
                return res.redirect('back');
            }
        }
    }
}

export default InspirationalServices;