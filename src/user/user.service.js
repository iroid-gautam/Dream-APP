import commonService from "../../utils/commonServices";
import User from "../../model/user";
import fs from "fs";
import path from "path";
import { ConflictException, NotFoundException, UnprocesssableEntityException, } from "../common/error-exceptions";
const { ObjectId } = require("mongodb");

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
}

export default UserService;
