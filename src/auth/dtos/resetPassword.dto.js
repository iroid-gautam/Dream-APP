import Joi from "joi";

export default Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.any().equal(Joi.ref("password")).required(),
});
