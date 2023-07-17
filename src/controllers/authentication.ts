import express from 'express';
import jwt from 'jsonwebtoken'
import { getUserByEmail, createuser, getUserBySessionToken } from '../db/users';
import { random, authentication } from '../helpers';
import { get, merge } from 'lodash';
require('dotenv').config()

export const register = async(req: express.Request, res: express.Response) => {
    try{
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.sendStatus(400);
        }
        
        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.sendStatus(400);
        }


        const salt =  process.env.salt
        const user = await createuser ({
            email,
            username,
            authentication: {
                password: authentication(salt, password),
                
            },
        });
        merge(req, { identity: user })
        
        return res.status(200).json(user).end();

    

    }   catch (error) {

        console.log(error);
        return res.sendStatus(400);
    }
}



export const login = async (req: express.Request, res: express.Response) => {
    try{
        const { email, password } = req.body;

        if(!email || !password) {
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

        if(!user) {
            return res.sendStatus(400);
        }

        const expectedHash = authentication(process.env.salt, password);

        if (user.authentication.password != expectedHash){
            return res.sendStatus(403);
        }
        
        // APO EDW const salt = random();
        // user.authentication.sessionToken = authentication(salt, user._id.toString());

        // await user.save();
        
        
        // res.cookie('STEF-AUTH', user.authentication.sessionToken, {domain: 'localhost', path: '/'}); MEXRI EDW

        const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m"});
        const refreshToken = jwt.sign({user}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "2d"});
        user.authentication.refreshToken = refreshToken
        merge(req, { identity: user })
        res.cookie("jwt", refreshToken, {
            httpOnly: true, maxAge: 48 * 60 * 60 * 1000
        }).json({ user, accessToken }).end();

            
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}




export const refreshTokens = async(req: express.Request, res: express.Response) => {
    const cookies = req.cookies
    const { email } = req.body

    if(!cookies?.jwt) return res.sendStatus(401);

    // console.log(cookies.jwt);
    
    const refreshToken = cookies.jwt;

    const head = req.headers['authorization'];
    const foundToken = head.split(' ')[1];

    const foundUser = await getUserByEmail(email)

    // console.log(foundToken);
    if(!foundToken) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err:any, decoded:any) => {
        if(err) return res.sendStatus(403);
        const accessToken = jwt.sign({foundUser}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m"});
        return res.json({ foundUser, accessToken });
    }
    );
}