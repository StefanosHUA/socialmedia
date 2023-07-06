import express from 'express'

import { deleteUser, getAllUsers, updateUser } from '../controllers/users';
import { isAuthenticated, isOwner, cookieJWTAuth } from '../middlewares';



export default (router: express.Router) => {
    router.get('/users', cookieJWTAuth, getAllUsers);
    router.delete('/users/:id', cookieJWTAuth, isOwner,  deleteUser);
    router.patch('/users/:id', cookieJWTAuth, isOwner, updateUser) 
    
};