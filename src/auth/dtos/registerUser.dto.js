import Joi from "joi";

export default Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.any().equal(Joi.ref("password")).required(),
  termCondition: Joi.number().optional(),
});
