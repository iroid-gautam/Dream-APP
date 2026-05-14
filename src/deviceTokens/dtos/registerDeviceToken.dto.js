import Joi from "joi";

export default Joi.object().keys({
  fcmToken: Joi.string().trim().required(),
  platform: Joi.string().valid("android", "ios", "web").required(),
  deviceId: Joi.string().trim().max(255).required(),
});
