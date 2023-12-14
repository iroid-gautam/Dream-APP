import commonService from "../../utils/commonServices";
import User from "../../model/user";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { BadRequestException, ConflictException, NotFoundException, UnprocesssableEntityException, } from "../common/error-exceptions";
const { ObjectId } = require("mongodb");
import { BCRYPT } from "../common/constants/constant";
import AuthHelper from "../common/auth.helper";
import sendMail from "../common/middlewares/send-mail.middleware";
import Otp from "../../model/otp";
import { OTPTYPE } from "../common/constants/constant";
import UserSubscription from "../../model/userSubscription";
import { auth } from "firebase-admin";
import moment from "moment";
import { PremiumUserFind } from "../common/helper";
import AccessToken from "../../model/accessToken";
import RefreshToken from "../../model/refreshToken";
import MyHabits from "../../model/myHabits";
import MyGoal from "../../model/myGoal";
import MyJournal from "../../model/myJournal";
import MyIntention from "../../model/myIntention";
import MentalState from "../../model/mentalState";
import FcmToken from "../../model/fcmToken";
import FlippedCards from "../../model/flippedCards";

class UserService {
    /**
     * get login user details
     * @param {*} user
     */
    static async index(user) {
        if (ObjectId.isValid(user._id)) {
            const data = await commonService.findOne(User, { _id: user._id });

            const isSub = await PremiumUserFind(user._id);

            const subscription = await UserSubscription.findOne({ userId: user._id })

            return { data, isSub, subscription };
        } else {
            throw new UnprocesssableEntityException("User id invalid");
        }
    }

    /**
     * update user
     * @param {*} data
     */
    static async update(data) {
        // if (data.reqData.email) {
        //     const query = {
        //         email: data.reqData.email,
        //         _id: { $ne: data.user._id },
        //     };
        //     const checkExistEmail = await commonService.findOne(User, query);

        //     if (checkExistEmail) {
        //         throw new ConflictException("Email already exist");
        //     }
        // }
        await commonService.updateOne(User, { _id: data.user._id }, data.reqData);

        return true;
    }



    /**
     * @description : Delete User account
     * @param {*} id 
     * @param {*} req 
     * @param {*} res 
     */
    static async deleteAccount(id, req, res) {
        try {
            await User.findByIdAndDelete({ _id: id });
            await AccessToken.deleteMany({ userId: id });
            await RefreshToken.deleteMany({ userId: id });
            await MyHabits.deleteMany({ userId: id });
            await MyGoal.deleteMany({ userId: id });
            await MyIntention.deleteMany({ userId: id });
            await MyJournal.deleteMany({ userId: id });
            await MentalState.deleteMany({ userId: id });
            await FcmToken.deleteMany({ userId: id });
            await FlippedCards.deleteMany({ userId: id });
            return
        } catch (err) {
            console.log(err);
            throw new BadRequestException("Something went wrong");
        }
    }


    /**
     * @description: Change email
     * @param {*} auth 
     * @param {*} data 
     */
    static async emailChange(auth, data) {
        const { email } = data;
        const checkEmailIsInUse = await commonService.findOne(User, {
            email: email
        });

        if (checkEmailIsInUse) {
            throw new ConflictException("Email address already in use.");
        }

        await commonService.updateById(User, auth, { isVerified: false });

        const generateOTP = await AuthHelper.generateOTP();

        const obj = {
            to: email,
            subject: `Verify Email`,
            otp: generateOTP,
            type: OTPTYPE.REGISTRATION_OTP,
        };

        const send = await sendMail(obj, "otp-mail");

        if (send) {
            const exitOtp = await commonService.findOne(Otp, { email: email });
            if (exitOtp) {
                await commonService.updateById(Otp, exitOtp._id, {
                    email: email,
                    otp: generateOTP,
                    type: OTPTYPE.REGISTRATION_OTP,
                });
                return true;
            } else {
                await commonService.createOne(Otp, {
                    email: email,
                    otp: generateOTP,
                    type: OTPTYPE.REGISTRATION_OTP,
                });
            }
        }
    }




    /**
     * @description: Email verified
     * @param {*} auth 
     * @param {*} data 
     */
    static async emailVerifyOTP(auth, data) {
        const { email, otp } = data;
        const findEmail = await commonService.findOne(Otp, { email: email });
        if (!findEmail) {
            throw new BadRequestException("Invalid email.");
        } else {
            if (otp == findEmail.otp) {
                const updateStatus = await commonService.updateById(User, auth, {
                    email: findEmail.email,
                    isVerified: true
                });
                await commonService.findOneAndDelete(Otp, { email: email, otp: otp })
            } else {
                throw new BadRequestException("Invalid otp.");
            }
        }

    }


    /**
     * @description: user picture update
     * @param {*} auth 
     * @param {*} file 
     * @param {*} req 
     * @param {*} res 
     */
    static async userProfilePictureUpdate(auth, file, req, res) {
        if (file) {
            const profile = file.destination + "/" + file.filename;
            const findUser = await commonService.findByPk(User, { _id: auth });
            if (findUser) {
                try {
                    await fs.unlinkSync(path.join(__dirname, '../../', findUser.profileImage))
                } catch (err) {
                    await commonService.updateById(User, auth, {
                        profileImage: profile
                    });
                }

                await commonService.updateById(User, auth, {
                    profileImage: profile
                });

                return true;

            } else {
                throw new NotFoundException("This user is not found")
            }
        } else {
            const findUser = await commonService.findByPk(User, { _id: auth });

            const profile = findUser.profileImage !== null ? findUser.profileImage : null;

            await commonService.updateById(User, auth, {
                profileImage: profile
            });

            return true;
        }
    }



    /**
     * @description: Change password
     * @param {*} auth 
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     */
    static async changePassword(auth, data, req, res) {
        const { currentPassword, newPassword, confirmNewPassword } = data;

        const findUser = await commonService.findById(User, { _id: auth });

        const matchPass = await bcrypt.compare(currentPassword, findUser.password);
        if (!matchPass) {
            throw new BadRequestException("Current password invalid")
        }

        if (newPassword == confirmNewPassword) {
            const hashPass = await bcrypt.hash(newPassword, BCRYPT.SALT_ROUND)
            const updatePass = await commonService.updateById(User, { _id: findUser._id }, {
                password: hashPass
            });
            return updatePass;
        } else {
            throw new BadRequestException("New password or confirm password not match")
        }

    }
}

export default UserService;
