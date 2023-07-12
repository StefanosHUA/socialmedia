import express from 'express';

import { deleteUserById, getUserById, getUsers } from '../db/users';
import { getPostById, deletePostById } from '../db/posts';
import { newPost } from '../db/posts';
import { get, merge } from 'lodash';

export const createNewPost = async(req: express.Request, res: express.Response) => {
    try{
        const { desc, img } = req.body;

        if ( !desc || !img) {
            return res.sendStatus(400);
        }
        
        const new_post = await newPost ({
            desc,
            img, 
            
        });
        console.log(new_post.user)
        merge(req, { identity: new_post })
        return res.status(200).json(new_post).end();

        

    }   catch (error) {

        console.log(error);
        return res.sendStatus(400);
    }
}


export const updatePost = async(req: express.Request, res: express.Response) => {
    try{
        const { id } = req.params;
        const { desc, img } = req.body;

        

        if (!desc || !img){
            return res.sendStatus(400);
        }

        const post = await getPostById(id);
        post.desc = desc
        post.img = img
        await post.save();

        return res.status(200).json(post).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}



export const deletePost = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        const deletedPost = await deletePostById(id);

        return res.json(deletedPost);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}


export const newComment = async(req:express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;

        if (!comment){
            return res.sendStatus(400);
        }

        const post = await getPostById(id);

        post.comments = comment
        
        
        await post.save();
        return res.status(200).json(post).end();

    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}



export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try{
        const users = await getUsers();
        return res.status(200).json(users);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try{
        const { id } = req.params;

        const deletedUser = await deleteUserById(id);

        return res.json(deletedUser);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}


export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { username } = req.body;

        if(!username) {
            return res.sendStatus(400);
        }
        
        const user = await getUserById(id);

        user.username = username;
        await user.save();

        return res.status(200).json(user).end();

    } catch (error) {
        console.log(error)
        return res.sendStatus(400);
    }
}