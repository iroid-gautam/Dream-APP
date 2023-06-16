import Joi from "joi";

export default Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        // .regex(/^(?=.{8,})(?=.*[A-Z]).*$/)
        .required(),
        // .messages({
        // "string.pattern.base": "Password does not meet the requirements",
        // }),
    confirmPassword: Joi.any().equal(Joi.ref('password'))
        .required()
        .label('Confirm password'),
    profileImage: Joi.required(),
    termCondition: Joi.optional()
});