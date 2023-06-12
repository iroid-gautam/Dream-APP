import mongoose, { Schema } from "mongoose";
import { BCRYPT } from "../src/common/constants/constant";
import bcrypt from "bcryptjs";

const userSchema = new Schema( 
    {
        name: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: false,
        },
        password: {
            type: String,
            required: false,
        },
        profileImage: {
            type: String,
            required: false,
            default: null,
        },
        termCondition: {
            type: Number,
            default: 0,
        },
        isVerified: {
            type: Boolean,
            required: false,
            default: false,
        },
        isForgotPasswordVerified: {
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

// pre-save middleware
userSchema.pre("save", async function (next) {
    const user = this;
    if (user.password) {
      user.password = await bcrypt.hash(user.password, BCRYPT.SALT_ROUND); // hash password
    }
    next();
});

userSchema.pre('update', async function () {
    const userdata = this.getUpdate().$set;
  
    if (userdata.password) {
      userdata.password = await bcrypt.hash(userdata.password,  BCRYPT.SALT_ROUND);
    }
});
  

userSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

module.exports = mongoose.model('users', userSchema);