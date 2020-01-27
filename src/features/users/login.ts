import { Primitive, validate } from 'validate-typescript';
import { getManager } from 'typeorm';
import { UserEntity } from '../../models/UserEntity';
import { isValidPassword, getToken } from './shared';
import { Request, Response } from 'express';

const userLoginSchema = {
    user: {
        email: Primitive(String),
        password: Primitive(String),
    },
};

export async function login(req: Request, res: Response) {
    const userLogin = validate(userLoginSchema, req.body);
    const manager = getManager();

    const {
        email,
        password,
    } = userLogin.user;

    const user = await manager.findOne(
        UserEntity,
        { email },
    );

    if (!user) {
        return res.status(404).json({
            errors: { body: ['user does not exist'] },
        });
    }

    if (!isValidPassword(user, password)) {
        return res.status(401).json({
            errors: { body: ['password is incorrect'] },
        });
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
