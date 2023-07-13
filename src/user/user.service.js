import commonService from "../../utils/commonServices";
import User from "../../model/user";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { BadRequestException, ConflictException, NotFoundException, UnprocesssableEntityException, } from "../common/error-exceptions";
const { ObjectId } = require("mongodb");
import { BCRYPT } from "../common/constants/constant";

class UserService {
    /**
     * get login user details
     * @param {*} user
     */
    static async index(user) {
        if (ObjectId.isValid(user._id)) {
            const data = await commonService.findOne(User, { _id: user._id });
            return data;
        } else {
            throw new UnprocesssableEntityException("User id invalid");
        }
    }

    /**
     * update user
     * @param {*} data
     */
    static async update(data) {
        if (data.reqData.email) {
            const query = {
                email: data.reqData.email,
                _id: { $ne: data.user._id },
            };
            const checkExistEmail = await commonService.findOne(User, query);

            if (checkExistEmail) {
                throw new ConflictException("Email already exist");
            }
        }
        await commonService.updateOne(User, { _id: data.user._id }, data.reqData);

        return true;
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
