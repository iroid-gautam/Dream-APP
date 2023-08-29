import mongoose from "mongoose";

const flippedSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    cardId: {
        type: mongoose.Schema.Types.ObjectId
    },
    type: {
        type: Number       // 1 => Inspiration quotes , 2 => affiarmation , 3 => question & conte , 4 => strategy , 5 => little paw
    }
}, { timestamps: true });

const FlippedCards = mongoose.model('flippedcard', flippedSchema);

export default FlippedCards;