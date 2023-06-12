import mongoose, { Schema } from 'mongoose';

const accessTokenSchema = new mongoose.Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: "User" 
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    isRevoked: {
        type: Boolean,
        required: false,
        default: false,
      },
    expiresAt: {
        type: Date,
        required: false,
    },
},
{
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
})

const AccessToken = mongoose.model('access_tokens', accessTokenSchema);

export default AccessToken;