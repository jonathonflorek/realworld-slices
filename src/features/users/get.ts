import { EntityManager } from 'typeorm';
import { CurrentUser } from '../../types';
import { UserResponse, getToken } from './shared';
import { resultFactory } from '../../util';
import { UserEntity } from '../../models/UserEntity';

interface GetUserResult {
    success: UserResponse;
}

const result = resultFactory<GetUserResult>();

export async function handleGetUser(
    currentUser: CurrentUser,
    manager: EntityManager,
) {
    const { id } = currentUser;

    const user = await manager.findOne(UserEntity, { id });

    if (!user) {
        throw new Error(`the current user ${id} is not in the database`);
    }

    const token = getToken(user);
    return result('success', {
        username: user.username,
        token,
        email: user.email,
        bio: user.bio,
        image: user.image,
    });
}
