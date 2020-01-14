import * as jwt from 'express-jwt';
import { secret } from './config';
import { Request } from 'express-serve-static-core';
import { CurrentUser } from './types';

function getTokenFromHeader(req: Request) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}

const userProperty = 'user';

export const auth = {
    required: jwt({
        secret,
        userProperty,
        getToken: getTokenFromHeader,
    }),    
}

declare module 'express-serve-static-core' {
    interface Request {
        [userProperty]: CurrentUser;
    }
}
