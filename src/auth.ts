import * as jwt from 'express-jwt';
import { secret } from './config';
import { Request } from 'express-serve-static-core';
import { CurrentUser } from './types';

function getTokenFromHeader(req: Request) {
    if (!req.headers.authorization) {
        return null;
    }

    const [type, token] = req.headers.authorization.split(' ');
    if (['token', 'bearer'].includes(type.toLowerCase())) {
        return token;
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

// extend Express.Request with the CurrentUser object so we can use it after authorizing.
declare module 'express-serve-static-core' {
    interface Request {
        [userProperty]: CurrentUser;
    }
}
