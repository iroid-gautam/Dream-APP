import Joi from "joi";

export default Joi.object()
  .keys({
    name: Joi.string().trim().min(2).max(120).optional(),
    newEmail: Joi.string().trim().email().optional(),
  })
  .or("name", "newEmail");
