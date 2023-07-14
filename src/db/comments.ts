import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const commentsSchema = new mongoose.Schema(
    {   
        comment: {
            type: String,
            max:250,
        },

        post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},

        user: { type: ObjectId, ref: 'User' }
    },
    { timestamps: true }
);

commentsSchema.path('user').ref('User');
commentsSchema.path('post').ref('Post');

;
export const comments = mongoose.model('comments', commentsSchema);

export const getCommentsbyPostId = (post: string) => comments.find({ post })
export const getComments = () => comments.find()
export const newComment = (values: Record<string, any>) => new comments(values).save().then((comments) => comments.toObject());
export const getcommentById = (id: string) => comments.findById(id);
export const deletecommentById = (id: string) => comments.findOneAndDelete({ _id:id });

