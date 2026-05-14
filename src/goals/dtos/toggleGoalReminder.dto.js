import Joi from "joi";

export default Joi.object().keys({
  reminderEnabled: Joi.boolean().required(),
});
