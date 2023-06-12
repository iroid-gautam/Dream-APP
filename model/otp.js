import mongoose, { Schema } from 'mongoose';

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: false,
        },
        otp: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['1', '2'],
            comment: '[1 => registration, 2 => forgot password]'
        },
        isExpired   : {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    }
);

const Otp = mongoose.model('otps', otpSchema);

export default Otp;