import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true
    }
}, { timestamps: true });

const Admin = mongoose.model('admin', adminSchema);

export default Admin;