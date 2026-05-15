import Joi from "joi";
import { OTP_TYPE_CODE } from "../../common/constants/constant";

export default Joi.object().keys({
  email: Joi.string().email().required(),
  type: Joi.number().valid(OTP_TYPE_CODE.REGISTRATION, OTP_TYPE_CODE.LOGIN).required(),
});
