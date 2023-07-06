import mongoose from "mongoose";

const insightsSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        trim: true,
        default: null
    },
    description: {
        type: String,
        trim: true
    }
}, { timestamps: true });

const OurInsights = mongoose.model("ourinsight", insightsSchema);

export default OurInsights;