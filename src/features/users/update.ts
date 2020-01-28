import { getSaltHash, getToken } from './shared';
import { getManager } from 'typeorm';
import { UserEntity } from '../../models/UserEntity';
import { Request, Response } from 'express';

import * as t from 'io-ts';
import { either } from 'fp-ts';
import { failure } from 'io-ts/lib/PathReporter'

const UserUpdate = t.strict({
    user: t.exact(t.partial({
        email: t.string,
        password: t.string,
        username: t.string,
        bio: t.string,
        image: t.string,
    })),
});

export async function update(req: Request, res: Response) {
    const currentUser = req.user;
    const manager = getManager();

    const userUpdate = UserUpdate.decode(req.body);

    if (either.isLeft(userUpdate)) {
        return res.status(422).json({
            errors: { body: failure(userUpdate.left) },
        });
    }

    const { id } = currentUser;
    const {
        email,
        password,
        username,
        bio,
        image,
    } = userUpdate.right.user;

    const user = await manager.findOne(UserEntity, { id });

    if (!user) {
        throw new Error(`the current user ${id} is not in the database`);
    }

    if (password !== undefined) {
        Object.assign(user, getSaltHash(password));
    }

    if (email) {
        user.email = email;
    }

    if (username) {
        user.username = username;
    }

    if (bio) {
        user.bio = bio;
    }

    if (image) {
        user.image = image;
    }

    const savedUser = await manager.save(user);
    const token = getToken(savedUser);

    res.status(200).json({
        user: {
            username: savedUser.username,
            token,
            email: savedUser.email,
            bio: savedUser.bio,
            image: savedUser.image,
        }
    });
}
