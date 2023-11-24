import mongoose from "mongoose";

const journalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        trim: true,
        default: null
    }
}, { timestamps: true });

const MyJournal = mongoose.model('myjournal', journalSchema);

export default MyJournal;