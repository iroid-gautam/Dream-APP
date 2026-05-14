class commonService {
  static async findAllRecord(model, query) {
    return model.find(query);
  }

  static async findOne(model, query) {
    return model.findOne(query);
  }

  static async createOne(model, data) {
    return model.create(data);
  }

  static async findByPk(model, id) {
    return model.findById(id);
  }

  static async updateOne(model, query, data) {
    return model.updateOne(query, data);
  }

  static async deleteOne(model, query) {
    return model.deleteOne(query);
  }

  static async updateById(model, id, data) {
    return model.findByIdAndUpdate(id, data, { new: true });
  }

  static async totalDocuments(model, data) {
    return model.countDocuments(data);
  }

  static async findById(model, query) {
    return model.findById(query);
  }

  static async deleteById(model, id) {
    return model.findByIdAndDelete(id);
  }

  static async findOneAndDelete(model, data) {
    return model.findOneAndDelete(data);
  }
}

export default commonService;
