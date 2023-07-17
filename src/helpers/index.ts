import crypto from 'crypto';

export const random = () => crypto.randomBytes(128).toString('base64');
export const authentication = (salt: string, password: string) => {
    return crypto.createHmac('sha256', [process.env.salt, password.toString].join('/')).update(process.env.SECRET).digest('hex');
};