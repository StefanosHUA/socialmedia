import express from 'express';
import { UserModel, deleteUserById, getUserByEmail, getUserById, getUsers } from '../db/users';
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


export const GetPosts = async (req: express.Request, res: express.Response) => {
    // destructure page and limit and set default values
    const { page = 1, limit = 10 } = req.query;
  
    try {
      // execute query with page and limit values
      const posts = await Post.find()
        .limit((limit as any) * 1)
        .skip(((page as any) - 1) * (limit as any))
        .exec();
  
      // get total documents in the Posts collection
      const count = await Post.countDocuments();
  
      // return response with posts, total pages, and current page
      res.json({
        posts,
        totalPages: Math.ceil(count / (limit as any)),
        currentPage: page,
      });
    } catch (err) {
      console.error(err.message);
    }
  };

export const getMyPosts = async (req: express.Request, res: express.Response) => {
    const { page = 1, limit = 10 } = req.query;
    try{
            
    const currUser = await getUserById(req.user._id)
    const myPosts = await getPostByUserId(currUser.id)
        // execute query with page and limit values
      
      .limit((limit as any) * 1)
      .skip(((page as any) - 1) * (limit as any))
      .exec();

    // get total documents in the Posts collection
    const count = myPosts.length

    // return response with posts, total pages, and current page
    res.json({
      myPosts,
      totalPages: Math.ceil(count / (limit as any)),
      currentPage: page,
    });
  } catch (err) {
    console.error(err.message);
  }
}

export const getUserPosts = async (req: express.Request, res: express.Response) => {
    const { page = 1, limit = 10 } = req.query;
    try{
        const { userEmail } = req.body
        const currUser = await getUserByEmail(userEmail)
        const myPosts = await getPostByUserId(currUser.id) 
            // execute query with page and limit values
          
          .limit((limit as any) * 1)
          .skip(((page as any) - 1) * (limit as any))
          .exec();
    
        // get total documents in the Posts collection
        const count = myPosts.length
    
        // return response with posts, total pages, and current page
        res.json({
          myPosts,
          totalPages: Math.ceil(count / (limit as any)),
          currentPage: page,
        });
      } catch (err) {
        console.error(err.message);
      }
    }




export const getAllUsers = async (req: express.Request, res: express.Response) => {
    const { page = 1, limit = 10 } = req.query;
    try{
        const { userEmail } = req.body
        const currUser = await getUserByEmail(userEmail)
        const allusers = await UserModel.find()
            // execute query with page and limit values
          .limit((limit as any) * 1)
          .skip(((page as any) - 1) * (limit as any))
          .exec();
    
        // get total documents in the Posts collection
        const count = await UserModel.countDocuments();
    
        // return response with posts, total pages, and current page
        res.json({
          allusers,
          totalPages: Math.ceil(count / (limit as any)),
          currentPage: page,
        });
      } catch (err) {
        console.error(err.message);
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