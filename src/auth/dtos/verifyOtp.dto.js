import Joi from "joi";
import { OTP_TYPE_CODE } from "../../common/constants/constant";

export default Joi.object().keys({
  email: Joi.string().email().required(),
  otp: Joi.string().length(4).required(),
  type: Joi.number()
    .valid(
      OTP_TYPE_CODE.REGISTRATION,
      OTP_TYPE_CODE.LOGIN,
      OTP_TYPE_CODE.FORGOT_PASSWORD
    )
    .required(),
});
