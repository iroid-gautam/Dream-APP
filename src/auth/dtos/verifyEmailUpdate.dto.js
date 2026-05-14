import Joi from "joi";

export default Joi.object().keys({
  otp: Joi.string().trim().required(),
});
