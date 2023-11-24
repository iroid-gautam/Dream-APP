import mongoose from "mongoose";

const mentalStateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    // score: {
    //     type: Number,
    //     required: true
    // },
    emojiId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'emoji'
    },
    added: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const MentalState = mongoose.model('mentalState', mentalStateSchema);

export default MentalState;