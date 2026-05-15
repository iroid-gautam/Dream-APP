import Joi from "joi";

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

export default Joi.object().keys({
  username: Joi.string().trim().min(2).max(50).required(),
  dream: Joi.string().trim().min(5).max(1000).required(),
  godWhisperIds: Joi.array()
    .items(Joi.string().trim().guid({ version: "uuidv4" }))
    .min(1)
    .required(),
  reminderTime: Joi.string().trim().pattern(timePattern).required(),
});
