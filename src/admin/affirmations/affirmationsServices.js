import path from "path";
import fs from "fs"
import Affirmation from "../../../model/affirmations";
import commonService from "../../../utils/commonServices";


class AffirmationServices {
    /**
     * @description: Listing page
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async listingAffirmationsPage(req, res) {
        return res.render('admin/affirmations/listing');
    }



    /**
     * @description: Get listing
     * @param {*} query 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async getListingAffirmations(query, req, res) {
        const { start, length, search, draw } = query;
        const page = parseInt(start) || 0;
        const limit = parseInt(length) || 10;

        const search_value = search.value;
        const search_query = {
            $or: [{ "type": { $regex: search_value, $options: 'i' } },]
        };

        const data = await Affirmation.find(search_value ? search_query : {}).skip(page).limit(limit).sort({ 'createdAt': -1 });
        const count = await commonService.totalDocuments(Affirmation, data);

        return res.send({
            draw: draw,
            iTotalRecords: count,
            iTotalDisplayRecords: count,
            aaData: data
        });
    }



    /**
     * @description: Add affirmations page
     * @param {*} req 
     * @param {*} res 
     */
    static async addAffirmationsPage(req, res) {
        return res.render('admin/affirmations/addAffirmation');
    }




    /**
     * @description: Add affirmations
     * @param {*} data 
     * @param {*} files 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async addAffirmations(data, files, req, res) {

        const { frontImage, flipImage } = files;

        const front = `affirmations/${frontImage[0].filename}`;
        const flip = `affirmations/${flipImage[0].filename}`;

        data.frontImage = front
        data.flipImage = flip

        const storeAffirmation = await commonService.createOne(Affirmation, data);

        req.flash('success', 'Affirmations added successfully');
        return res.redirect('/admin/affirmation');
    }




    /**
     * @description: Delete Affirmations
     * @param {*} id 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async deleteAffirmations(id, req, res) {
        const deleteAffirmationsById = await commonService.deleteById(Affirmation, { _id: id });
        if (!deleteAffirmationsById) {
            return res.redirect('back');
        } else {
            try {
                await fs.unlinkSync(path.join(__dirname, '../../../public/', deleteAffirmationsById.frontImage));
                await fs.unlinkSync(path.join(__dirname, '../../../public/', deleteAffirmationsById.flipImage));
                return res.redirect('back');
            } catch (err) {
                return res.redirect('back');
            }
        }
    }

}


export default AffirmationServices;