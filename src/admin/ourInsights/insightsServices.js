import OurInsights from "../../../model/ourInsights";
import commonService from "../../../utils/commonServices";
import path from "path";
import fs from "fs";

class InsightsServices {


    /**
     * @description: Listing insights page
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async listingInsightsPage(req, res) {
        return res.render('admin/ourInsights/viewInsights');
    }



    /**
     * @description: Listing our insights
     * @param {*} query 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async listingInsights(query, req, res) {
        const { start, length, search, draw } = query;
        const page = parseInt(start) || 0;
        const limit = parseInt(length) || 10;

        const search_value = search.value;
        const search_query = {
            $or: [{ "title": { $regex: search_value, $options: 'i' } }, { "description": { $regex: search_value, $options: 'i' } },]
        };

        const data = await OurInsights.find(search_value ? search_query : {}).skip(page).limit(limit).sort({ 'createdAt': -1 });
        const count = await commonService.totalDocuments(OurInsights, data);

        const total_records_with_filter = await commonService.totalDocuments(OurInsights, search_query);

        return res.send({
            draw: draw,
            iTotalRecords: count,
            iTotalDisplayRecords: total_records_with_filter,
            aaData: data
        });
    }



    /**
     * @description: insights add page
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async addInsightsPage(req, res) {
        return res.render('admin/ourInsights/addInsights')
    }



    /**
     * @description: Add insights
     * @param {*} data 
     * @param {*} file 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async insightsAdd(data, file, req, res) {
        const { title, description } = data;

        if (file) {
            const image = `ourInsights/${file.filename}`;
            const addInsights = await commonService.createOne(OurInsights, {
                title: title,
                image: image,
                description: description
            });

            req.flash('success', 'Insights added successfully')
            return res.redirect('/admin/ourinsights');
        } else {
            const addInsights = await commonService.createOne(OurInsights, {
                title: title,
                description: description
            });

            req.flash('success', 'Insights added successfully')
            return res.redirect('/admin/ourinsights');
        }
    }



    /**
     * @description: Update page
     * @param {*} id
     * @param {*} res 
     */
    static async updateInsightPage(id, res) {
        const findInsight = await commonService.findById(OurInsights, { _id: id })
        return res.render('admin/ourInsights/editInsights', {
            "insightId": findInsight
        });
    }



    /**
     * @description: Update insights
     * @param {*} data 
     * @param {*} file 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async updateInsights(data, file, req, res) {
        const { id, title, description } = data;

        if (file) {
            const findInsightId = await commonService.findById(OurInsights, { _id: id });
            const image = `ourInsights/${file.filename}`;

            try {
                await fs.unlinkSync(path.join(__dirname, '../../../public/', findInsightId.image));
            } catch (err) {
                await commonService.updateById(OurInsights, findInsightId._id, {
                    title: title,
                    image: image,
                    description: description
                });
            }

            await commonService.updateById(OurInsights, findInsightId._id, {
                title: title,
                image: image,
                description: description
            });

            req.flash('success', 'Insights updated successfully');
            return res.redirect('/admin/ourinsights');
        } else {

            const findInsightId = await commonService.findById(OurInsights, { _id: id })

            await commonService.updateById(OurInsights, findInsightId._id, {
                title: title,
                description: description
            });

            req.flash('success', 'Insights updated successfully');
            return res.redirect('/admin/ourinsights');
        }
    }




    /**
     * @description: Insights delete
     * @param {*} id 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async insightsDelete(id, req, res) {
        const deleteInsightsById = await commonService.deleteById(OurInsights, { _id: id });
        if (!deleteInsightsById) {
            return res.redirect('back');
        } else {
            try {
                await fs.unlinkSync(path.join(__dirname, '../../../public/', deleteInsightsById.image));
                return res.redirect('back');
            } catch (err) {
                return res.redirect('back');
            }
        }
    }
}

export default InsightsServices;