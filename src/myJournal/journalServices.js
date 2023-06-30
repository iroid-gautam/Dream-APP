import MyJournal from "../../model/myJournal";
import commonService from "../../utils/commonServices";
import JournalListingResource from "./resources/journalListingResource";


class JournalServices {
    /**
     * @description: Add journal
     * @param {*} auth 
     * @param {*} file 
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async addJournal(auth, file, data, req, res) {
        const { description } = data;
        if (file) {
            const image = `myJournal/${file.filename}`;
            const insertJournal = await commonService.createOne(MyJournal, {
                userId: auth,
                description: description,
                image: image,
            });

            return insertJournal;
        } else {
            const insertJournal = await commonService.createOne(MyJournal, {
                userId: auth,
                description: description,
            });
            return insertJournal;
        }
    }



    /**
     * @description: Get all journal listing
     * @param {*} auth 
     * @param {*} query 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async getAllJournalListing(auth, query, req, res) {
        const page = parseInt(query.page) - 1 || 0;
        const pageLimit = parseInt(query.limit) || 20;

        const findJournals = await MyJournal.find({ userId: auth }).skip(page * pageLimit).limit(pageLimit);

        const totalDocument = await commonService.totalDocuments(MyJournal, { userId: auth });

        const meta = {
            total: totalDocument,
            perPage: pageLimit,
            currentPage: page + 1,
            lastPage: Math.ceil(totalDocument / pageLimit),
        }

        return { data: new JournalListingResource(findJournals), meta: meta }
    }
}

export default JournalServices;