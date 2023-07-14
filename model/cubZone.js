import mongoose from "mongoose";

const cubZoneSchema = mongoose.Schema({
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

const CubZone = mongoose.model('cubzone', cubZoneSchema);

export default CubZone;