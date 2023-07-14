import express from 'express'
import { createComment, updateComment, deleteComment, getCommentsfromPost  } from '../controllers/comments';
import { deleteUser, getAllUsers, updateUser, createNewPost, updatePost, deletePost, getMyPosts, getUserPosts, getAllPosts } from '../controllers/users';
import { isAuthenticated, isOwner, cookieJWTAuth, isPostOwner, isCommentOwner } from '../middlewares';



export default (router: express.Router) => {

    //CRUD
    router.get('/users/:pageNum', cookieJWTAuth, getAllUsers);
    router.delete('/users/:id', cookieJWTAuth, isOwner,  deleteUser);
    router.patch('/users/:id', cookieJWTAuth, isOwner, updateUser);
    
    //POSTS
    router.post("/createPost/", cookieJWTAuth, createNewPost);
    router.patch("/updatePost/:id", cookieJWTAuth, isPostOwner, updatePost);
    router.delete("/deletePost/:id", cookieJWTAuth, isPostOwner, deletePost);

    //GET MY POSTS
    router.get("/getMyPosts/:pageNum", cookieJWTAuth, getMyPosts);

    //GET ALL POSTS
    router.get("/getAllPosts/:pageNum", cookieJWTAuth, getAllPosts);

    //GET A USER'S POSTS
    router.get("/getPosts/:pageNum", cookieJWTAuth, getUserPosts);

    //COMMENTS
    router.post("/comment/:id", cookieJWTAuth, createComment);
    router.patch("/editComment/:id", cookieJWTAuth, isCommentOwner, updateComment);
    router.delete("/deleteComment/:id", cookieJWTAuth, isCommentOwner, deleteComment);

    //GET POST COMMENTS
    router.get("/getComments/:id/:pageNum", cookieJWTAuth, getCommentsfromPost);

};