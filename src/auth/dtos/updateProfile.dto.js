import Joi from "joi";

const isValidTimezone = (value, helpers) => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: value });
    return value;
  } catch (error) {
    return helpers.error("any.invalid");
  }
};

export default Joi.object()
  .keys({
    firstName: Joi.string().trim().min(2).max(60).optional(),
    lastName: Joi.string().trim().min(2).max(60).optional(),
    email: Joi.string().trim().email().optional(),
    timezone: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .custom(isValidTimezone)
      .optional(),
  })
  .or("firstName", "lastName", "email", "timezone");
