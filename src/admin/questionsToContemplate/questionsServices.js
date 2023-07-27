import path from "path";
import fs from "fs";
import commonService from "../../../utils/commonServices";
import QuestionsToContemplate from "../../../model/questions";

class QuestionsToContemplateServices {
    /**
     * @description: Listing page
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async questionsListingPage(req, res) {
        return res.render('admin/questionsToConte/listing');
    }



    /**
     * @description: Get listing 
     * @param {*} query 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async getListingQuestions(query, req, res) {
        const { start, length, search, draw } = query;
        const page = parseInt(start) || 0;
        const limit = parseInt(length) || 10;

        const search_value = search.value;
        const search_query = {
            $or: [{ "type": { $regex: search_value, $options: 'i' } },]
        };

        const data = await QuestionsToContemplate.find(search_value ? search_query : {}).skip(page).limit(limit).sort({ 'createdAt': -1 });
        const count = await commonService.totalDocuments(QuestionsToContemplate, data);

        const total_records_with_filter = await commonService.totalDocuments(QuestionsToContemplate, search_query);

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
    static async addQuestionsPage(req, res) {
        return res.render('admin/questionsToConte/add');
    }



    /**
     * @description add questions to contemplate
     * @param {*} data 
     * @param {*} files 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async addQuestionsContemplate(data, files, req, res) {
        const { frontImage, flipImage } = files;

        const front = `questions/${frontImage[0].filename}`;
        const flip = `questions/${flipImage[0].filename}`;

        data.frontImage = front
        data.flipImage = flip

        const storeInspiration = await commonService.createOne(QuestionsToContemplate, data);

        req.flash('success', 'Questions to contemplate added successfully');
        return res.redirect('/admin/questions');
    }



    /**
     * @description: Delete questions
     * @param {*} id 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async deleteQuestions(id, req, res) {
        const deleteQuetionsById = await commonService.deleteById(QuestionsToContemplate, { _id: id });
        if (!deleteQuetionsById) {
            return res.redirect('back');
        } else {
            try {
                await fs.unlinkSync(path.join(__dirname, '../../../public/', deleteQuetionsById.frontImage));
                await fs.unlinkSync(path.join(__dirname, '../../../public/', deleteQuetionsById.flipImage));
                return res.redirect('back');
            } catch (err) {
                return res.redirect('back');
            }
        }
    }
}

export default QuestionsToContemplateServices;