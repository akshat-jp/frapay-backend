import mongoose, { Schema, ObjectId } from "mongoose";
import connectdb from "./connectdb.js";



const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
    },
    password: String,
    firstname: {type: String, unique : true},
    lastname: String,
})

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    }
})

const UserModel = mongoose.model("User", UserSchema);
const AccountModel = mongoose.model("Account", accountSchema);

export { UserModel, AccountModel };