import User from "../../../model/user";
import commonService from "../../../utils/commonServices";

class usersServices {
    /**
     * @description: Users page load
     * @param {*} req 
     * @param {*} res 
     */
    static async usersPage(req, res) {
        return res.render('admin/users/usersTable');
    }



    /**
     * @description: View users
     * @param {*} query 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async viewUsers(query, req, res) {
        const { start, length, search, draw } = query;
        const page = parseInt(start) || 0;
        const limit = parseInt(length) || 10;

        const search_value = search.value;
        const search_query = {
            $or: [{ "name": { $regex: search_value, $options: 'i' } }, { "email": { $regex: search_value, $options: 'i' } },]
        };

        const data = await User.find(search_value ? search_query : {}).skip(page).limit(limit).sort({ 'created_at': -1 });
        const count = await commonService.totalDocuments(User, data);

        const total_records_with_filter = await commonService.totalDocuments(User, search_query);

        return res.send({
            draw: draw,
            iTotalRecords: count,
            iTotalDisplayRecords: total_records_with_filter,
            aaData: data
        });
    }
}

export default usersServices;