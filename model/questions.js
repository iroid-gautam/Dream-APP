import mongoose from "mongoose";

const questionSchema = mongoose.Schema({
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

const QuestionsToContemplate = mongoose.model('questionstocontemplate', questionSchema);

export default QuestionsToContemplate;