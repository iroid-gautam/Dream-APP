import mongoose from "mongoose";
import MyGoal from "../../model/myGoal";
import commonService from "../../utils/commonServices";
import { BadRequestException, NotFoundException } from "../common/error-exceptions"
import GoalResource from "./resources/goalResource";
import GoalProgressCompleteListingResource from "./resources/progressCompleteResource";
import { PremiumUserFind } from "../common/helper";
import moment from "moment";

class GoalServices {
    /**
     * @description: Add goal
     * @param {*} auth 
     * @param {*} file 
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     */
    static async addGoal(auth, file, data, req, res) {
        const { name, type, description, startDate, endDate, habitsId } = data;

        // const h = habitsId.split(',');

        // h.map(data => {
        //     if (mongoose.Types.ObjectId.isValid(data)) {
        //         return
        //     } else {
        //         throw new BadRequestException("Please provide correct habitId")
        //     }
        // })

        // try {
        const isSub = await PremiumUserFind(auth);

        if (isSub === true) {
            const nullHabit = habitsId === undefined ? null : habitsId.split(',')

            if (file) {
                const image = `goalImage/${file.filename}`;
                const insertGoal = await commonService.createOne(MyGoal, {
                    userId: auth,
                    name: name,
                    type: type,
                    description: description,
                    startDate: startDate,
                    endDate: endDate,
                    image: image,
                    habitsId: nullHabit
                });

                return { ...new GoalResource(insertGoal) };
            } else {
                // throw new BadRequestException("Please select image")
                const nullHabit = habitsId === undefined ? null : habitsId.split(',');

                const insertGoal = await commonService.createOne(MyGoal, {
                    userId: auth,
                    name: name,
                    type: type,
                    description: description,
                    startDate: startDate,
                    endDate: endDate,
                    habitsId: nullHabit
                });

                return { ...new GoalResource(insertGoal) };
            }
        } else {
            const currentDate = moment().format('YYYY-MM-DD');
            const alreadyAdd = await MyGoal.find({
                userId: auth,
                $expr: {
                    $eq: [
                        { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        { $dateToString: { format: "%Y-%m-%d", date: { $toDate: currentDate } } }
                    ]
                }
            })

            if (alreadyAdd.length > 0) {
                throw new BadRequestException("Please purchase premium plan and unlimited goals create")
            } else {
                const nullHabit = habitsId === undefined ? null : habitsId.split(',')

                if (file) {
                    const image = `goalImage/${file.filename}`;
                    const insertGoal = await commonService.createOne(MyGoal, {
                        userId: auth,
                        name: name,
                        type: type,
                        description: description,
                        startDate: startDate,
                        endDate: endDate,
                        image: image,
                        habitsId: nullHabit
                    });

                    return { ...new GoalResource(insertGoal) };
                } else {
                    // throw new BadRequestException("Please select image")
                    const nullHabit = habitsId === undefined ? null : habitsId.split(',');

                    const insertGoal = await commonService.createOne(MyGoal, {
                        userId: auth,
                        name: name,
                        type: type,
                        description: description,
                        startDate: startDate,
                        endDate: endDate,
                        habitsId: nullHabit
                    });

                    return { ...new GoalResource(insertGoal) };
                }
            }
        }

        // } catch (err) {
        //     console.log(err);
        //     throw new BadRequestException("Goal not created")
        // }
    }



    /**
     * @description: Get single goal
     * @param {*} id 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async getSingleGoal(id, req, res) {
        if (mongoose.Types.ObjectId.isValid(id)) {
            const findGoal = await MyGoal.findById({ _id: id }).populate('habitsId');
            if (findGoal) {
                return { ...new GoalResource(findGoal) }
            } else {
                throw new NotFoundException('This goalId is not found')
            }
        } else {
            throw new BadRequestException("please provide correct goalId")
        }
    }



    /**
     * @description: mark as done this goal
     * @param {*} id 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async markAsDoneGoal(id, req, res) {
        if (mongoose.Types.ObjectId.isValid(id)) {
            const findGoal = await commonService.findByPk(MyGoal, { _id: id });
            if (findGoal) {
                const updateStatus = await commonService.updateById(MyGoal, findGoal._id, {
                    markDone: true
                });
                return updateStatus;
            } else {
                throw new NotFoundException('This goalId is not found')
            }
        } else {
            throw new BadRequestException("please provide correct goalId")
        }
    }



    /**
     * @description: Delete goal
     * @param {*} id 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async deleteGoal(id, req, res) {
        if (mongoose.Types.ObjectId.isValid(id)) {
            const findGoal = await commonService.findByPk(MyGoal, { _id: id });
            if (findGoal) {
                const deleteHabit = await commonService.deleteById(MyGoal, findGoal._id);
                return deleteHabit
            } else {
                throw new NotFoundException('This goalId is not found')
            }
        } else {
            throw new BadRequestException("please provide correct goalId")
        }
    }



    /**
     * @description: Search goal
     * @param {*} auth 
     * @param {*} query 
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async searchGoal(auth, query, data, req, res) {
        try {
            const page = parseInt(query.page) - 1 || 0;
            const pageLimit = parseInt(query.limit) || 20;

            const { name } = data;

            const filterGoal = name == '' ? { userId: auth, markDone: false } : { userId: auth, name: { $regex: name, $options: 'i' }, markDone: false };

            const findGoal = await MyGoal.find(filterGoal).skip(page * pageLimit).limit(pageLimit).sort({ createdAt: -1 });

            const totalDocument = await commonService.totalDocuments(MyGoal, filterGoal);
            const exitsGoal = await MyGoal.countDocuments({ userId: auth });

            const meta = {
                total: totalDocument,
                perPage: pageLimit,
                currentPage: page + 1,
                lastPage: Math.ceil(totalDocument / pageLimit),
                goalsExits: exitsGoal === 0 ? false : true
            }

            return { data: findGoal, meta: meta }
        } catch (err) {
            throw new BadRequestException("Something went wrong")
        }
    }



    /**
     * @description: Goal progress completed status
     * @param {*} auth 
     * @param {*} query 
     * @param {*} req 
     * @param {*} res 
     */
    static async goalProgressCompleted(auth, query, req, res) {
        const page = parseInt(query.page) - 1 || 0;
        const pageLimit = parseInt(query.limit) || 20;

        const progress = await commonService.totalDocuments(MyGoal, { userId: auth });
        const completeGoal = await commonService.totalDocuments(MyGoal, { userId: auth, markDone: true });

        const { markDone } = query;
        const findGoal = await MyGoal.find({ userId: auth, markDone: markDone }).skip(page * pageLimit).limit(pageLimit).sort({ createdAt: -1 });

        const totalDocument = await commonService.totalDocuments(MyGoal, { userId: auth, markDone: markDone });

        const meta = {
            total: totalDocument,
            perPage: pageLimit,
            currentPage: page + 1,
            lastPage: Math.ceil(totalDocument / pageLimit),
        }

        const process = { progress: progress, complete: completeGoal };

        return { data: new GoalProgressCompleteListingResource(process, findGoal), meta }
    }
}

export default GoalServices;