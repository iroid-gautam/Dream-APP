import mongoose from "mongoose";

const inspirationSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true
    }
}, { timestamps: true });

const MyInspiration = mongoose.model('myinspiration', inspirationSchema);

export default MyInspiration;