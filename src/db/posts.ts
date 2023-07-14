
import mongoose, { mongo } from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema(
    {
        desc: {
            type:String,
            max:500,
            postedBy: {
                type: ObjectId, ref: "User"
            }
        },
        img: {
            type:String
        },
        // comments:[{
        //     type:String,
        //     postedBy: {
        //         type:mongoose.Schema.Types.ObjectId, ref:'User'
        //     }

        // }],
        user: { type: ObjectId, ref: "User" }
    },
    { timestamps: true }
);

postSchema.path('user').ref('User');

export const Post = mongoose.model('Post', postSchema);
export const getallposts = () => Post.find()
export const getPostByUserId = (user:string) => Post.find({ user })
// export const getComments = () => Post.find()
export const newPost = (values: Record<string, any>) => new Post(values).save().then((Post) => Post.toObject());
export const getPostById = (id: string) => Post.findById(id);
export const deletePostById = (id: string) => Post.findOneAndDelete({ _id:id });