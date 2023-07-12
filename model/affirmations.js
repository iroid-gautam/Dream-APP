import mongoose from "mongoose";

const affirmationsSchema = mongoose.Schema({
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

const Affirmation = mongoose.model('affirmation', affirmationsSchema);

export default Affirmation;