import mongoose from "mongoose";

const strategySchema = new mongoose.Schema({
    type: {
        type: String,           // Clarity | Courage | Activation
        trim: true,
        default: null
    },
    frontImage: {
        type: String,
        trim: true,
        default: null
    },
    flipImage: {
        type: String,
        trim: true,
        default: null
    },
    videoRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'videopodcast',
        default: null
    },
}, { timestamps: true });

const Strategy = mongoose.model('strategy', strategySchema);

export default Strategy;