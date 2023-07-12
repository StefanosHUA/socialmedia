import mongoose from "mongoose";
import { Post } from "./posts";
const MyObjectId = mongoose.Types.ObjectId;


const UserSchema = new mongoose.Schema({
    username: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    authentication: {
        password: { type: String, required: true, select: false},
        salt: { type: String, select: false},
        refreshToken: { type: String, select: false},

    },
    posts:[{type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});


export const UserModel = mongoose.model('User', UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail =  (email: string) => UserModel.findOne({ email }); 
export const getUserBySessionToken = (refreshToken: string) => UserModel.findOne({
    'authentication.refreshToken': refreshToken, 
});

export const getUserById = (id: string) => UserModel.findById(id);
export const createuser = (values: Record<string, any>) => new UserModel(values)
.save().then((user) => user.toObject());
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id:id });
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);
