import express from 'express';
import { get, merge } from 'lodash';
import jwt from 'jsonwebtoken'
import { getUserBySessionToken } from '../db/users';
import { Request } from "express"

declare module "express" { 
  export interface Request {
    user: any
  }
}



export const cookieJWTAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
    // console.log(authHeader)
    const token = authHeader.split(' ')[1];   
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,
        (err: any, decoded: any) => {
        if (err) return res.sendStatus(403);
        req.user = decoded.user;
        next();
        }
    )  
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


export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try { 
        const sessionToken = req.cookies['STEF-AUTH'];

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


