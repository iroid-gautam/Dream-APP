class CommonService {
  static async findAll(model, options = {}) {
    return model.findAll(options);
  }

  static async findOne(model, where = {}, options = {}) {
    return model.findOne({
      where,
      ...options,
    });
  }

  static async findByPk(model, id, options = {}) {
    return model.findByPk(id, options);
  }

  static async createOne(model, data = {}, options = {}) {
    return model.create(data, options);
  }

  static async update(model, values = {}, where = {}, options = {}) {
    return model.update(values, {
      where,
      ...options,
    });
  }

  static async destroy(model, where = {}, options = {}) {
    return model.destroy({
      where,
      ...options,
    });
  }
}

export default CommonService;
