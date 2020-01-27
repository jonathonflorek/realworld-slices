import { Primitive, validate } from 'validate-typescript';
import { getManager } from 'typeorm';
import { UserEntity } from '../../models/UserEntity';
import { getSaltHash, getToken } from './shared';
import { Request, Response } from 'express';

export const userRegisterSchema = {
    user: {
        username: Primitive(String),
        email: Primitive(String),
        password: Primitive(String),
    }
};

export async function register(req: Request, res: Response) {
    const userRegister = validate(userRegisterSchema, req.body);
    const manager = getManager();

    const {
        username,
        password,
        email,
    } = userRegister.user;

    const bio = '';
    const image = '';

    const existingByUsername = await manager.findOne(
        UserEntity,
        { username },
    );
    if (existingByUsername) {
        return res.status(422).json({ errors: { body: [`The username '${username}' is taken.`] } });
    }

    const existingByEmail = await manager.findOne(
        UserEntity,
        { email },
    );
    if (existingByEmail) {
        return res.status(422).json({ errors: { body: ['email is taken'] } });
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
