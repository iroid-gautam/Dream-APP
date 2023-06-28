import Joi from "joi";

export default Joi.object().keys({
    name: Joi.string().trim().required(),
    type : Joi.number().required(),
    description : Joi.string().trim().required(),
    startDate: Joi.string().trim().required(),
    endDate : Joi.string().trim().required(),
});