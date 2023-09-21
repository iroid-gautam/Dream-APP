import path from "path";
import fs from "fs";
import commonService from "../../../utils/commonServices";
import QuestionsToContemplate from "../../../model/questions";
import VideoPodcasts from "../../../model/videoAndPodcasts";

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
        const videos = await VideoPodcasts.find({ type: '1' });
        return res.render('admin/questionsToConte/add', { "videos": videos });
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
        data.videoRef = data.videoRef ? data.videoRef : null

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



    /**
     * @description: Edit question page
     * @param {*} id 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async editQuestionPage(id, req, res) {
        const findId = await QuestionsToContemplate.findById({ _id: id });
        const videos = await VideoPodcasts.find({ type: '1' });
        return res.render('admin/questionsToConte/edit', { 'videos': videos, 'question': findId });
    }



    /**
     * @description: Edit questions & contemplate
     * @param {*} data 
     * @param {*} files 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async editQuestions(data, files, req, res) {
        const { updateId } = data;
        const { frontImage, flipImage } = files;

        if (frontImage || flipImage) {
            const findQuestion = await QuestionsToContemplate.findById(updateId);

            const frontImageUp = frontImage ? `questions/${frontImage[0].filename}` : findQuestion.frontImage;
            const flipImageUp = flipImage ? `questions/${flipImage[0].filename}` : findQuestion.flipImage;
            try {
                frontImage ? await fs.unlinkSync(path.join(__dirname, '../../../public/', findQuestion.frontImage)) : findQuestion.frontImage
                flipImage ? await fs.unlinkSync(path.join(__dirname, '../../../public/', findQuestion.flipImage)) : findQuestion.flipImage
            } catch (err) {
                await QuestionsToContemplate.findByIdAndUpdate(updateId, {
                    frontImage: frontImageUp,
                    flipImage: flipImageUp
                }, { new: true })
            }

            data.frontImage = frontImageUp
            data.flipImage = flipImageUp

            await QuestionsToContemplate.findByIdAndUpdate(updateId, data);

            req.flash('success', 'Questions to contemplate updated successfully');
            return res.redirect('/admin/questions');

        } else {
            await QuestionsToContemplate.findByIdAndUpdate(updateId, data);

            req.flash('success', 'Questions to contemplate updated successfully');
            return res.redirect('/admin/questions');
        }

    }
}

export default QuestionsToContemplateServices;