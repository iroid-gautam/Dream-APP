import CubZone from "../../../model/cubZone";
import commonService from "../../../utils/commonServices";
import path from "path";
import fs from "fs";

class CubZoneServices {
    /**
     * @description: Cubzone listing page
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async cubzonelistingPage(req, res) {
        return res.render('admin/cubZone/listing');
    }



    /**
     * @description: Get listing cubzone listing
     * @param {*} query 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async getCubZoneListing(query, req, res) {
        const { start, length, search, draw } = query;
        const page = parseInt(start) || 0;
        const limit = parseInt(length) || 10;

        // const search_value = search.value;
        // const search_query = {
        //     $or: [{ "type": { $regex: search_value, $options: 'i' } },]
        // };

        const data = await CubZone.find({}).skip(page).limit(limit).sort({ 'createdAt': -1 });
        const count = await commonService.totalDocuments(CubZone, data);

        return res.send({
            draw: draw,
            iTotalRecords: count,
            iTotalDisplayRecords: count,
            aaData: data
        });
    }



    /**
     * @description: Add cubzone page
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async cubZoneAddPage(req, res) {
        return res.render('admin/cubZone/add');
    }



    /**
     * @description: add cubzone
     * @param {*} files 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async addCubZone(files, req, res) {
        const { frontImage, flipImage } = files;

        const front = `cubzone/${frontImage[0].filename}`;
        const flip = `cubzone/${flipImage[0].filename}`;

        const storeCubZone = await commonService.createOne(CubZone, {
            frontImage: front,
            flipImage: flip
        });

        req.flash('success', 'Cub zone added successfully');
        return res.redirect('/admin/cubzone');
    }



    /**
     * @description: Delete cubzone
     * @param {*} id 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async deleteCubZone(id, req, res) {
        const deleteCubZoneById = await commonService.deleteById(CubZone, { _id: id });
        if (!deleteCubZoneById) {
            return res.redirect('back');
        } else {
            try {
                await fs.unlinkSync(path.join(__dirname, '../../../public/', deleteCubZoneById.frontImage));
                await fs.unlinkSync(path.join(__dirname, '../../../public/', deleteCubZoneById.flipImage));
                return res.redirect('back');
            } catch (err) {
                return res.redirect('back');
            }
        }
    }
}

export default CubZoneServices;