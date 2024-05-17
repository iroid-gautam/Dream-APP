import mongoose from "mongoose";

const versionSchema = new mongoose.Schema({
    minVersion: {
        type: String,
        trim: true
    },
    latestVersion: {
        type: String,
        trim: true
    },
    platform: {
        type: String,
        trim: true
    },
    appLink: {
        type: String,
        trim: true
    }
}, { timestamps: true });

const Version = mongoose.model("versions", versionSchema);

export default Version;