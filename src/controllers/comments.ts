import express from 'express';
import { getPostById, deletePostById } from '../db/posts';
import { newComment, getcommentById, deletecommentById } from '../db/comments';
import { getUserById } from 'db/users';

export const createComment = async(req:express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;

        if (!comment){
            return res.sendStatus(400);
        }
        
        const post = await getPostById(id);
        

        // const user = await getUserById(post.user.toJSON)

        const newCom = await newComment ({
            comment,
            post: id,
            user: post.user._id
            
        });

        
        return res.status(200).json(newCom).end();

    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}



export const updateComment = async(req: express.Request, res: express.Response) => {
    try{
        const { id } = req.params;
        const { comment } = req.body;

        

        if (!comment){
            return res.sendStatus(400);
        }

        const com = await getcommentById(id);
        com.comment = comment
        await com.save();

        return res.status(200).json(com).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}


export const deleteComment = async(req: express.Request, res: express.Response) => {
    try{

        const { id } = req.params;

        const checkCom = getcommentById(id)

        if (!checkCom){
            return res.sendStatus(400);
        }

        const com = await deletecommentById(id);
        return res.status(200).json(com).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}


export const getCommentsfromPost = async(req: express.Request, res: express.Response) => {
    try{

        const { id } = req.params;

        const post = getcommentById(id)

        if (!post){
            return res.sendStatus(400);
        }

        const com = await deletecommentById(id);
        return res.status(200).json(com).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
