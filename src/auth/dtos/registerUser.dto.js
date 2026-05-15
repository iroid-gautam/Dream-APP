import Joi from "joi";

export default Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  termCondition: Joi.number().valid(0, 1).optional(),
});
