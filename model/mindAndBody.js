import mongoose from "mongoose";

const mindBodySchema = mongoose.Schema({
    title: {
        type: String,
        trim: true
    }
}, { timestamps: true });

const MyMindBody = mongoose.model('mymindbody', mindBodySchema);

export default MyMindBody;