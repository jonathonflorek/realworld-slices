import { Primitive } from 'validate-typescript';
import { EntityManager } from 'typeorm';
import { UserEntity } from '../../models/UserEntity';
import { isValidPassword, getToken, UserResponse } from './shared';
import { resultFactory } from '../../util';

export const userLoginSchema = {
    user: {
        email: Primitive(String),
        password: Primitive(String),
    },
};

interface UserLoginResults {
    success: UserResponse;
    userDoesNotExist: true;
    passwordIncorrect: true;
}

const result = resultFactory<UserLoginResults>();

export async function handleUserLogin(
    manager: EntityManager,
    userLogin: typeof userLoginSchema,
) {
    const {
        email,
        password,
    } = userLogin.user;

    const user = await manager.findOne(
        UserEntity,
        { email },
    );

    if (!user) {
        return result('userDoesNotExist', true);
    }

    if (!isValidPassword(user, password)) {
        return result('passwordIncorrect', true);
    }

    const token = getToken(user);
    return result('success', {
        username: user.username,
        token,
        email,
        bio: user.bio,
        image: user.image,
    });
}
