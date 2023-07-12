import express from 'express';
import { get, merge } from 'lodash';
import jwt from 'jsonwebtoken'
import { getUserBySessionToken, getUserById } from '../db/users';
import { getPostById } from '../db/posts';
import { Request } from "express"

declare module "express" { 
  export interface Request {
    user: any
  }
}



export const cookieJWTAuth = async(req: express.Request, res: express.Response, next: express.NextFunction) => {
    try{
    const { id } = req.body;
    const existingUser = await getUserById(id)
    
    const { postid } = req.params;
    const existingPost = await getPostById(postid)

    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
    
    const token = authHeader.split(' ')[1];

    merge(req, { identity: existingUser })
    merge(req, { identity: existingPost})   
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,
        (err: any, decoded: any) => {
        if (err) return res.sendStatus(403);
        req.user = decoded.user;
        next();
        }
        
    )  
    
    } catch (error){
    console.log(error);
    return res.sendStatus(400);
    }
        
    
};

// req.user = user;
        // next();
    // } catch(error) {
    //     // res.clearCookie("token").sendStatus(403);
        
    // }

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        
        const { id } = req.params; 
        const currentUserId = get(req, 'identity._id') as string; 
        
        if (!currentUserId) {
            return res.sendStatus(403);

        }

        if (currentUserId.toString() != id) {
            return res.sendStatus(403);
        }
        
        next();

    } catch (error){
        console.log(error);
        return res.sendStatus(400);

    }
}


export const isPostOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { id } = req.params;
        const currentPost = await getPostById(id)
        // console.log("\ncurrent post is:", currentPost)

        const currentuserId = req.body

        console.log(JSON.stringify(currentuserId.currentuserId))

        console.log("\n current user id is: ", currentuserId)

        if (!currentPost) {
            return res.sendStatus(403);
        }

        if (currentuserId.currentuserId != currentPost.id){
            // console.log("here", currentPost.userId)
            // console.log("", currentuserId.currentuserId)
            return res.sendStatus(403);
        
        }
        next();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}


export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try { 
        const sessionToken = req.cookies['jwt'];

        if (!sessionToken) {
            return res.sendStatus(403);
        }

        const existingUser = await getUserBySessionToken(sessionToken);

        if (!existingUser) {
            return res.sendStatus(403);
        }

        merge(req, { identity: existingUser });

        return next();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    } 
}


