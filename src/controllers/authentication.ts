import express from 'express';
import jwt from 'jsonwebtoken'
import { getUserByEmail, createuser, getUserBySessionToken } from '../db/users';
import { random, authentication } from '../helpers';
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


        const salt =  random();
        const user = await createuser ({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
                
            },
        });
        
        

        // const token = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m"});
        // const refreshToken = jwt.sign({user}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "2d"});

        // user.authentication.refreshToken = refreshToken

        // res.cookie("jwt", refreshToken, {
        //     httpOnly: true, maxAge: 48 * 60 * 60 * 1000
        // }).json({ user, token }).end();


        // res.json({ token})
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

        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password != expectedHash){
            return res.sendStatus(403);
        }
        
        // APO EDW const salt = random();
        // user.authentication.sessionToken = authentication(salt, user._id.toString());

        // await user.save();
        
        
        // res.cookie('STEF-AUTH', user.authentication.sessionToken, {domain: 'localhost', path: '/'}); MEXRI EDW

        const token = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m"});
        const refreshToken = jwt.sign({user}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "2d"});
        user.authentication.refreshToken = refreshToken

        res.cookie("jwt", refreshToken, {
            httpOnly: true, maxAge: 48 * 60 * 60 * 1000
        }).json({ user, token }).end();

            
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}




export const refreshTokens = async(req: express.Request, res: express.Response) => {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(401);
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;

    const foundUser = await getUserBySessionToken(refreshToken);

    console.log(foundUser);

    if(!foundUser) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err:any, decoded:any) => {
        if(err || foundUser.username !== decoded.username) return res.sendStatus(403);
        const accessToken = jwt.sign({foundUser}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m"});
        res.json({ accessToken }) 
    }
    );
}