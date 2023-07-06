import express from 'express';

import { register, login, refreshTokens } from '../controllers/authentication';
import { cookieJWTAuth } from '../middlewares';

export default (router: express.Router) => {
    router.post('/auth/register', register);
    router.post('/auth/login', login);
    router.get('/refreshTokens', refreshTokens);
};

