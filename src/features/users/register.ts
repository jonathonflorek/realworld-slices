import { Primitive } from 'validate-typescript';
import { EntityManager } from 'typeorm';
import { UserEntity } from '../../models/UserEntity';
import { getSaltHash, getToken, UserResponse } from './shared';
import { resultFactory } from '../../util';

export const userRegisterSchema = {
    user: {
        username: Primitive(String),
        email: Primitive(String),
        password: Primitive(String),
    }
};

interface UserRegisterResults {
    success: UserResponse;
    usernameTaken: {
        username: string;
    };
    emailTaken: {
        email: string;
    };
}

const result = resultFactory<UserRegisterResults>();

export async function handleUserRegister(
    manager: EntityManager,
    userRegister: typeof userRegisterSchema,
) {
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
        return result('usernameTaken', { username });
    }

    const existingByEmail = await manager.findOne(
        UserEntity,
        { email },
    );
    if (existingByEmail) {
        return result('emailTaken', { email });
    }

    const {
        salt,
        hash,
    } = getSaltHash(password);

    const createdUser = new UserEntity();
    Object.assign(createdUser, { salt, hash, username, email, bio, image });
    const user = await manager.save(createdUser);

    const token = getToken(user);
    return result('success', {
        username,
        token,
        email,
        bio,
        image,
    });
}
