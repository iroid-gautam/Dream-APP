import mongoose from "mongoose";
import MyHabits from "../../model/myHabits";
import commonService from "../../utils/commonServices";
import { BadRequestException, NotFoundException } from "../common/error-exceptions";
import MyGoal from "../../model/myGoal";
import SingleHabitResource from "./resources/singleHabitResource";
import HabitListingResource from "./resources/habitListingResources";


class HabitsServices {
    /**
     * @description: Add habits
     * @param {*} auth 
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async addHabits(auth, data, req, res) {
        const { name, frequency, description, startDate, goalId } = data;
        if (mongoose.Types.ObjectId.isValid(goalId)) {
            const findGoal = await commonService.findByPk(MyGoal, goalId);
            if (findGoal) {
                const addhabit = await commonService.createOne(MyHabits, {
                    userId: auth,
                    name: name,
                    frequency: frequency,
                    description: description,
                    startDate: startDate,
                    goalId: goalId
                });

                return { ...new SingleHabitResource(addhabit) }
            } else {
                throw new NotFoundException("This goal is not found")
            }
        } else {
            throw new BadRequestException('Please provide correct goalId')
        }
    }



    /**
     * @description: Get habit
     * @param {*} id 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async getSingleHabit(id, req, res) {
        if (mongoose.Types.ObjectId.isValid(id)) {
            const findHabit = await MyHabits.findById({ _id: id }).populate('goalId')
            if (findHabit) {
                return { ...new SingleHabitResource(findHabit) }
            } else {
                throw new NotFoundException('This habitId is not found')
            }
        } else {
            throw new BadRequestException("please provide correct habitId")
        }
    }



    /**
     * @description: Mark as done habit
     * @param {*} id 
     * @param {*} req 
     * @param {*} res 
     */
    static async markAsDoneHabit(id, req, res) {
        if (mongoose.Types.ObjectId.isValid(id)) {
            const findHabit = await commonService.findByPk(MyHabits, { _id: id });
            if (findHabit) {
                const updateStatus = await commonService.updateById(MyHabits, findHabit._id, {
                    markDone: true
                });
                return updateStatus;
            } else {
                throw new NotFoundException('This habitId is not found')
            }
        } else {
            throw new BadRequestException("please provide correct habitId")
        }
    }



    /**
     * @description: Habit listing
     * @param {*} auth 
     * @param {*} query 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async habitsListing(auth, query, req, res) {
        try {
            const page = parseInt(query.page) - 1 || 0;
            const pageLimit = parseInt(query.limit) || 20;

            const h0 = await MyHabits.countDocuments({ userId: auth, frequency: 0 });
            const h1 = await MyHabits.countDocuments({ userId: auth, frequency: 1 });
            const h2 = await MyHabits.countDocuments({ userId: auth, frequency: 2 });

            const h0Done = await MyHabits.countDocuments({ userId: auth, frequency: 0, markDone: true });
            const h1Done = await MyHabits.countDocuments({ userId: auth, frequency: 1, markDone: true });
            const h2Done = await MyHabits.countDocuments({ userId: auth, frequency: 2, markDone: true });

            const { frequency } = query;
            const filterHabit = frequency == -1 ? { userId: auth } : { userId: auth, frequency: frequency };

            const findHabits = await MyHabits.find(filterHabit).skip(page * pageLimit).limit(pageLimit);

            const totalDocument = await commonService.totalDocuments(MyHabits, filterHabit);

            const meta = {
                total: totalDocument,
                perPage: pageLimit,
                currentPage: page + 1,
                lastPage: Math.ceil(totalDocument / pageLimit),
            }

            const progress = { h0, h1, h2, h0Done, h1Done, h2Done }

            return { data: new HabitListingResource(progress, findHabits), meta }

        } catch (err) {
            throw new BadRequestException("Something went wrong")
        }
    }



    /**
     * @description: Delete habits
     * @param {*} id 
     * @param {*} req 
     * @param {*} res 
     */
    static async deleteHabits(id, req, res) {
        if (mongoose.Types.ObjectId.isValid(id)) {
            const findHabit = await commonService.findByPk(MyHabits, { _id: id });
            if (findHabit) {
                const deleteHabit = await commonService.deleteById(MyHabits, id);
                return deleteHabit
            } else {
                throw new NotFoundException('This habitId is not found')
            }
        } else {
            throw new BadRequestException("please provide correct habitId")
        }
    }



    /**
     * @description: Edit habits
     * @param {*} id 
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async editHabit(id, data, req, res) {
        const { name, frequency, description, startDate, goalId } = data;
        if (mongoose.Types.ObjectId.isValid(id)) {
            const findHabit = await commonService.findByPk(MyHabits, { _id: id });
            if (findHabit) {
                const editHabit = await commonService.updateById(MyHabits, findHabit._id, {
                    name: name,
                    frequency: frequency,
                    description: description,
                    startDate: startDate,
                    goalId: goalId
                });

                return editHabit;
            } else {
                throw new NotFoundException('This habitId is not found')
            }
        } else {
            throw new BadRequestException("please provide correct habitId")
        }
    }



    /**
     * @description: Search habit
     * @param {*} auth 
     * @param {*} query 
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async searchHabitFilter(auth, query, data, req, res) {
        try {
            const page = parseInt(query.page) - 1 || 0;
            const pageLimit = parseInt(query.limit) || 20;

            const { name } = data;

            const filterHabit = name == '' ? { userId: auth } : { userId: auth, name: { $regex: name, $options: 'i' } };

            const findHabit = await MyHabits.find(filterHabit).skip(page * pageLimit).limit(pageLimit);;

            const totalDocument = await commonService.totalDocuments(MyHabits, filterHabit);

            const meta = {
                total: totalDocument,
                perPage: pageLimit,
                currentPage: page + 1,
                lastPage: Math.ceil(totalDocument / pageLimit),
            }

            return { data: findHabit, meta: meta }
        } catch (err) {
            throw new BadRequestException("Something went wrong")
        }
    }
}

export default HabitsServices;