import Joi from "joi";

export default Joi.object()
  .keys({
    firstName: Joi.string().trim().min(2).max(60).optional(),
    lastName: Joi.string().trim().min(2).max(60).optional(),
    email: Joi.string().trim().email().optional(),
  })
  .or("firstName", "lastName", "email");
