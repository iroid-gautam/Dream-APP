import mongoose from "mongoose";

const habitsSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    name: {
        type: String,
        trim: true
    },
    frequency: {
        type: Number,         // 0 -> Daily | 1 -> Weekly | 2 -> Monthly
    },
    days: [{
        type: Number         // 0 -> Su | 1 -> Mo | 2 -> Tu | 3 -> We | 4 -> Th | 5 -> Fr | 6 -> Sa
    }],
    description: {
        type: String,
        trim: true
    },
    startDate: {
        type: Date,
    },
    markDone: {
        type: Boolean,
        default: false
    },
    goalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mygoal',
        default: null
    }
}, { timestamps: true });


const MyHabits = mongoose.model('myhabit', habitsSchema);

export default MyHabits;