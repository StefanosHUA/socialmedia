
import mongoose, { mongo } from "mongoose";
import { UserModel } from "./users";
const MyObjectId = mongoose.Types.ObjectId;

const postSchema = new mongoose.Schema(
    {
        // userId:[{
        //     type:String,
        //     postedBy:{
                

        //     } 
        // }],
        desc: {
            type:String,
            max:500,
            postedBy: {
                type:mongoose.Schema.Types.ObjectId, ref: 'User'
            }
        },
        img: {
            type:String
        },
        comments:[{
            type:String,
            postedBy: {
                type:mongoose.Schema.Types.ObjectId, ref:'User'
            }

        }],
        user: { type:MyObjectId, ref: 'User' }
    },
    { timestamps: true }
);

postSchema.path('user').ref('User');

export const Post = mongoose.model('Post', postSchema);

export const newPost = (values: Record<string, any>) => new Post(values).save().then((Post) => Post.toObject());
export const getPostById = (id: string) => Post.findById(id);
export const deletePostById = (id: string) => Post.findOneAndDelete({ _id:id });