// Add database related methods


class commonService {

    // Find All record from database
    static async findAllRecord(model, query) {
        const result = await model.find(query);

        return result;
    }
    
    // Find one record 
    static async findOne(model, query) {
        const result = await model.findOne(query);

        return result;
    }
    
    // insert single record in database
    static async createOne(model, data) {
        const result = await model.create(data);

        return result;
    }

    // find record by id
    static async findByPk(model, id) {
        const result = await model.findById(id);
        return result
    }

    // Update record 
    static async updateOne(model, query, data) {
        const result = await model.updateOne(query, data);

        return result;
    }

    // delete record 
    static async deleteOne(model, query, data) {
        const result = await model.deleteOne(query);

        return result;
    }

    /*
     * @description : update any record in database by primary key
     * @param {*} model 
     * @param {*} id 
     * @param {*} data 
     * @returns 
     */
    static async updateById(model, id, data) {
        const result = await model.findByIdAndUpdate(id, data, { new: true });
        return result;
    }

    /*
     * @description : total collection data find(20)
     * @param {*} model 
     * @param {*} id 
     * @param {*} data 
     * @returns 
     */
    static async totalDocuments(model, data) {
        const result = await model.countDocuments(data);
        return result;
    }


    /*
     * @description : find single id from table by query
     * @param  {object} model : mongodb model
     * @param  {object} query : {}
     * @param {object} options : {}
     * @return {object} result : database result
     */
    static async findById(model, query) {
        const result = await model.findById(query);
        return result;
    };

    /*
     * @description : delete any record in database by primary key
     * @param  {object} model : mongodb model
     * @param  {object} pk : primary field of table
     * @return {object} result : database result
     */

    static async deleteById(model, id) {
        const result = await model.findByIdAndDelete(id);
        return result;
    }


    /*
     * @description : delete any record in database by primary key
     * @param  {object} model : mongodb model
     * @param  {object} pk : primary field of table
     * @return {object} result : database result
     */

    static async findOneAndDelete(model, data) {
        // console.log(id);
        const result = await model.findOneAndDelete(data);
        return result;
    }

}

export default commonService;



