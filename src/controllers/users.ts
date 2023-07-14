import express from 'express';
import { deleteUserById, getUserByEmail, getUserById, getUsers } from '../db/users';
import { getPostById, deletePostById, Post, getPostByUserId, getallposts } from '../db/posts';
import { newPost } from '../db/posts';
import { get, merge } from 'lodash';
import { ObjectId } from 'mongodb';


export const createNewPost = async(req: express.Request, res: express.Response) => {
    try{
        const { desc, img } = req.body;

        if ( !desc || !img) {
            return res.sendStatus(400);
        }
        const currUser = await getUserById(req.user._id) 

        const new_post = await newPost ({
            desc,
            img,
            user: req.user._id
            
        });

        currUser.posts.push(new_post)
        // console.log(currUser.posts) 
        
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

        const getPost = await getPostById(id);

        if (!getPost){
            return res.sendStatus(400);
        }

        const deletedPost = await deletePostById(id);

        return res.json(deletedPost);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}



export const getMyPosts = async (req: express.Request, res: express.Response) => {
    try{

        const currUser = await getUserById(req.user._id)
        

        var { pageNum } = req.params

        const myPosts = await getPostByUserId(currUser.id) 
        function getPaginatedData(page: number, pageSize: number): any {
            const startIndex = (page - 1) * pageSize;
            const endIndex = page * pageSize;
            const paginatedData = myPosts.slice(startIndex, endIndex);
            const totalItems = myPosts.length;
            const totalPages = Math.ceil(totalItems / pageSize);
          
            return {
              data: paginatedData,
             
            currentPage: page,
            totalPages: totalPages,
            totalItems: totalItems,
              
            };
          }

        var y:number = +pageNum

        // const page = 1;
        const pageSize = 10;
        const result = getPaginatedData(y, pageSize);
        // console.log(currUser.id)

        return res.status(200).json(result);
        
    

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getUserPosts = async (req: express.Request, res: express.Response) => {
    try{

        var { pageNum } = req.params
        const { userEmail } = req.body
        const currUser = await getUserByEmail(userEmail)
        

        const myPosts = await getPostByUserId(currUser.id) 
        function getPaginatedData(page: number, pageSize: number): any {
            const startIndex = (page - 1) * pageSize;
            const endIndex = page * pageSize;
            const paginatedData = myPosts.slice(startIndex, endIndex);
            const totalItems = myPosts.length;
            const totalPages = Math.ceil(totalItems / pageSize);
          
            return {
              data: paginatedData,
             
            currentPage: page,
            totalPages: totalPages,
            totalItems: totalItems,
              
            };
          }

        var y:number = +pageNum

        // const page = 1;
        const pageSize = 10;
        const result = getPaginatedData(y, pageSize);
        // console.log(currUser.id)

        return res.status(200).json(result);
        
    

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}



export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try{
        
        var { pageNum } = req.params

        const users = await getUsers(); 
        function getPaginatedData(page: number, pageSize: number): any {
            const startIndex = (page - 1) * pageSize;
            const endIndex = page * pageSize;
            const paginatedData = users.slice(startIndex, endIndex);
            const totalItems = users.length;
            const totalPages = Math.ceil(totalItems / pageSize);
          
            return {
              data: paginatedData,
             
            currentPage: page,
            totalPages: totalPages,
            totalItems: totalItems,
              
            };
          }

        var y:number = +pageNum

        // const page = 1;
        const pageSize = 10;
        const result = getPaginatedData(y, pageSize);
        return res.status(200).json(result);

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