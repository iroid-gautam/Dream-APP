import mongoose from "mongoose";

const videoAndPodSchema = mongoose.Schema({
    type: {                         // 1 => videos || 2 => podcasts
        type: String,
        trim: true
    },
    title: {
        type: String,
        trim: true
    },
    // thumbnail: {
    //     type: String,
    //     trim: true
    // },
    description: {
        type: String,
        trim: true
    },
    videoPodcast: {
        type: String,
        trim: true
    }
}, { timestamps: true });

const VideoPodcasts = mongoose.model('videopodcast', videoAndPodSchema);

export default VideoPodcasts;