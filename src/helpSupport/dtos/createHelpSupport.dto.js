import Joi from "joi";

export default Joi.object().keys({
  type: Joi.string()
    .trim()
    .valid("feedback", "feature_request", "problem_report")
    .optional(),
  description: Joi.string().trim().min(1).max(5000).required(),
});
