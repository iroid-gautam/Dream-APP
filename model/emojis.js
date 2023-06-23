import mongoose from "mongoose";

const emojiSchema = mongoose.Schema({
    emoji: {
        type: String,
        trim: true
    }
}, { timestamps: true });

const Emojis = mongoose.model('emoji', emojiSchema);

export default Emojis;