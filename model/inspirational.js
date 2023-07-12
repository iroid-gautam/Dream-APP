import mongoose from "mongoose";

const inspirationalSchema = mongoose.Schema({
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
    }
}, { timestamps: true });

const Inspirational = mongoose.model('inspirational', inspirationalSchema);

export default Inspirational;