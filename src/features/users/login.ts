import { getManager } from 'typeorm';
import { UserEntity } from '../../models/UserEntity';
import { isValidPassword, getToken } from './shared';
import { Request, Response } from 'express';

import * as t from 'io-ts';
import { either, pipeable } from 'fp-ts';
import { failure } from 'io-ts/lib/PathReporter'

const UserLogin = t.strict({
    user: t.strict({
        email: t.string,
        password: t.string,
    }),
});

export async function login(req: Request, res: Response) {
    const manager = getManager();
    const userLogin = pipeable.pipe(
        req.body,
        UserLogin.decode,
        either.mapLeft(failure),
    );

    if (either.isLeft(userLogin)) {
        return res.status(422).json({
            errors: { body: userLogin.left },
        });
    }

    const {
        email,
        password,
    } = userLogin.right.user;

    const user = await manager.findOne(
        UserEntity,
        { email },
    );

    if (!user) {
        return res.status(401).end();
    }

    if (!isValidPassword(user, password)) {
        return res.status(401).end();
    }

    const token = getToken(user);
    return res.status(200).json({
        user: {
            username: user.username,
            token,
            email,
            bio: user.bio,
            image: user.image,
        },
    });
}
