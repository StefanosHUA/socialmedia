import express from 'express'

import { deleteUser, getAllUsers, updateUser, createNewPost, updatePost, deletePost, newComment } from '../controllers/users';
import { isAuthenticated, isOwner, cookieJWTAuth, isPostOwner } from '../middlewares';



export default (router: express.Router) => {

    //CRUD
    router.get('/users', cookieJWTAuth, getAllUsers);
    router.delete('/users/:id', cookieJWTAuth, isOwner,  deleteUser);
    router.patch('/users/:id', cookieJWTAuth, isOwner, updateUser);
    
    //POSTS
    router.post("/createPost/", cookieJWTAuth, createNewPost);
    router.patch("/updatePost/:id", cookieJWTAuth, updatePost);
    router.delete("/deletePost/:id", cookieJWTAuth, isPostOwner, deletePost);

    //COMMENTS
    router.patch("/comment/:id", newComment);
};