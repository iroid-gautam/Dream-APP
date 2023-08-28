import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    orderId: {
        type: String,
        trim: true
    },
    originalTransactionId: {
        type: String,
        trim: true
    },
    cancelledAt: {
        type: Boolean,
        default: null
    },
    purchaseToken: {
        type: String,
        trim: true
    },
    purchaseDate: {
        type: Date
    },
    purchasePlatform: {
        type: String,
        trim: true
    },
    autoRenewing: {
        type: String,
        trim: true
    },
    expiryDate: {
        type: Date
    },
    receipt: {
        type: Object
    },
    isFreeTrialUse: {
        type: Boolean
    }
}, { timestamps: true });

const UserSubscription = mongoose.model('userSubscription', subscriptionSchema);

export default UserSubscription;