import Joi from "joi";

export default Joi.object().keys({
  fcmToken: Joi.string().trim().required(),
});
