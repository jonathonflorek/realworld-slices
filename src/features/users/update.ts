import { Optional, Primitive, validate } from 'validate-typescript';
import { getSaltHash, getToken } from './shared';
import { getManager } from 'typeorm';
import { UserEntity } from '../../models/UserEntity';
import { Request, Response } from 'express';

const userUpdateSchema = {
    user: {
        email: Optional(Primitive(String)),
        password: Optional(Primitive(String)),
        username: Optional(Primitive(String)),
        bio: Optional(Primitive(String)),
        image: Optional(Primitive(String)),
    },
};

export async function update(req: Request, res: Response) {
    const currentUser = req.user;
    const userUpdate = validate(userUpdateSchema, req.body);
    const manager = getManager();
    const { id } = currentUser;
    const {
        email,
        password,
        username,
        bio,
        image,
    } = userUpdate.user;

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
