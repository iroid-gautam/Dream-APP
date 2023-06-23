import mongoose from "mongoose";

const mentalStateSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    score: {
        type: Number,
        required: true
    },
    emojiId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'emoji'
    }
}, { timestamps: true });

const MentalState = mongoose.model('mentalState', mentalStateSchema);

export default MentalState;