import mongoose, { Schema, ObjectId } from "mongoose";


async function connectdb() {
    try {
        await mongoose.connect("mongodb+srv://kaalaananoob_db_user:dHW9h4Uaw2r4ngCM@cluster0.x18ahaa.mongodb.net/");
        console.log("server connected");
    } catch (err) {
        console.log("connection failed");
    }
}

connectdb();

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