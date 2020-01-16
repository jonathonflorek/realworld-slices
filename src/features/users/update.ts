import { Optional, Primitive } from 'validate-typescript';
import { UserResponse, getSaltHash, getToken } from './shared';
import { resultFactory } from '../../util';
import { EntityManager } from 'typeorm';
import { CurrentUser } from '../../types';
import { UserEntity } from '../../models/UserEntity';

export const userUpdateSchema = {
    user: {
        email: Optional(Primitive(String)),
        password: Optional(Primitive(String)),
        username: Optional(Primitive(String)),
        bio: Optional(Primitive(String)),
        image: Optional(Primitive(String)),
    },
};

interface UserUpdateResults {
    success: UserResponse;
}

const result = resultFactory<UserUpdateResults>();

export async function handleUserUpdate(
    currentUser: CurrentUser,
    manager: EntityManager,
    userUpdate: typeof userUpdateSchema,
) {
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
    return result('success', {
        username: savedUser.username,
        token,
        email: savedUser.email,
        bio: savedUser.bio,
        image: savedUser.image,
    });
}
