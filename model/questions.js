import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
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

const QuestionsToContemplate = mongoose.model('questionstocontemplate', questionSchema);

export default QuestionsToContemplate;