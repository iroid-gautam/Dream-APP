import mongoose from "mongoose";
import OurInsights from "../../model/ourInsights";
import commonService from "../../utils/commonServices";
import { BadRequestException, NotFoundException } from "../common/error-exceptions";
import SingleInsightsListingResource from "./resources/singleInsightsResource";


class InsightsServices {
    /**
     * @description: All insights listing
     * @param {*} query 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async allInsightsListing(query, req, res) {
        const page = parseInt(query.page) - 1 || 0;
        const pageLimit = parseInt(query.limit) || 20;

        const findAllInsights = await OurInsights.find({}).skip(page * pageLimit).limit(pageLimit);

        const totalDocument = await commonService.totalDocuments(OurInsights, {});

        const meta = {
            total: totalDocument,
            perPage: pageLimit,
            currentPage: page + 1,
            lastPage: Math.ceil(totalDocument / pageLimit),
        }

        return { data: findAllInsights, meta };
    }




    static async getSingleInsightsDetails(id, req, res) {
        if (mongoose.Types.ObjectId.isValid(id)) {
            const findInsights = await commonService.findById(OurInsights, { _id: id });
            if (findInsights) {
                return { ...new SingleInsightsListingResource(findInsights) };
            } else {
                throw new NotFoundException("This our insights id not found")
            }
        } else {
            throw new BadRequestException("Please provice correct insightsId");
        }
    }
}

export default InsightsServices;