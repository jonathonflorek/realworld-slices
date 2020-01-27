import { getManager } from 'typeorm';
import { getToken } from './shared';
import { UserEntity } from '../../models/UserEntity';
import { Request, Response } from 'express';

export async function get(req: Request, res: Response) {
    const currentUser = req.user;
    const manager = getManager();

    const { id } = currentUser;

    const user = await manager.findOne(UserEntity, { id });

    if (!user) {
        throw new Error(`the current user ${id} is not in the database`);
    }

    const token = getToken(user);
    return res.status(200).json({
        user: {
            username: user.username,
            token,
            email: user.email,
            bio: user.bio,
            image: user.image,
        },
    });
}
