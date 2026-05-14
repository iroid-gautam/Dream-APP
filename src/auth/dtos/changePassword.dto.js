import Joi from "joi";

export default Joi.object().keys({
  oldPassword: Joi.string().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.any().equal(Joi.ref("password")).required(),
});
