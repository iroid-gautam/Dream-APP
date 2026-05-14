import Joi from "joi";

export default Joi.object().keys({
  view: Joi.string().trim().lowercase().valid("all").optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});
