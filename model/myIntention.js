import mongoose from "mongoose";

const intentionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
}, { timestamps: true });


const MyIntention = mongoose.model('myintention', intentionSchema);

export default MyIntention;