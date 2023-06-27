import mongoose from "mongoose";

const goalSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    name: {
        type: String,
        trim: true
    },
    type: {
        type: Number,           // 0 -> Short || 1 -> Medium || 2 -> Long
    },
    description: {
        type: String,
        trim: true
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    image: {
        type: String,
        trim: true,
        default: null
    },
    markDone: {
        type: Boolean,
        default: false
    },
    habitsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'myhabit'
    }]
}, { timestamps: true });

const MyGoal = mongoose.model('mygoal', goalSchema);

export default MyGoal;