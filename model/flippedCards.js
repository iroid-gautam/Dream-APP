import mongoose from "mongoose";

const flippedSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    cardId: {
        type: mongoose.Schema.Types.ObjectId
    }
}, { timestamps: true });

const FlippedCards = mongoose.model('flippedcard', flippedSchema);

export default FlippedCards;