import { getManager } from 'typeorm';
import { UserEntity } from '../../models/UserEntity';
import { getSaltHash, getToken } from './shared';
import { Request, Response } from 'express';

import * as t from 'io-ts';
import { either } from 'fp-ts';
import { failure } from 'io-ts/lib/PathReporter'

const UserRegister = t.strict({
    user: t.strict({
        username: t.string,
        email: t.string,
        password: t.string,
    }),
});

export async function register(req: Request, res: Response) {
    const manager = getManager();

    const userRegister = UserRegister.decode(req.body);

    if (either.isLeft(userRegister)) {
        return res.status(422).json({
            errors: { body: failure(userRegister.left) },
        });
    }

    const {
        username,
        password,
        email,
    } = userRegister.right.user;

    const bio = '';
    const image = '';

    const existingByUsername = await manager.findOne(
        UserEntity,
        { username },
    );
    if (existingByUsername) {
        return res.status(422).json({
            errors: { body: [`The username '${username}' is taken.`] },
        });
    }

    const existingByEmail = await manager.findOne(
        UserEntity,
        { email },
    );
    if (existingByEmail) {
        return res.status(422).json({
            errors: { body: ['email is taken'] },
        });
    }

    const {
        salt,
        hash,
    } = getSaltHash(password);

    const createdUser = new UserEntity();
    Object.assign(createdUser, { salt, hash, username, email, bio, image });
    const user = await manager.save(createdUser);

    const token = getToken(user);
    return res.status(200).json({
        user: {
            username,
            token,
            email,
            bio,
            image,
        },
    });
}
