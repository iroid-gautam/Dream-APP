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
}

export default commonService;



