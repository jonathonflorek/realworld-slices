import { Router } from 'express';
import { auth } from '../../auth';
import { handleGetUser } from './get';
import { getManager } from 'typeorm';
import { validate } from 'validate-typescript';
import { userRegisterSchema, handleUserRegister } from './register';
import { userLoginSchema, handleUserLogin } from './login';
import { UserResponse } from './shared';
import { userUpdateSchema, handleUserUpdate } from './update';

const usersController = Router();

usersController.get('/', auth.required, async (req, res) => {
    const response = await handleGetUser(req.user, getManager());
    res.status(200).json(user(response));
});

usersController.post('/', async (req, res) => {
    const userRegistration = validate(userRegisterSchema, req.body);
    const response = await handleUserRegister(getManager(), userRegistration);
    switch (response.type) {
        case 'success':
            res.status(200).json(user(response));
            break;
        case 'emailTaken':
            res.status(422).json(error('email taken'));
            break;
        case 'usernameTaken':
            res.status(422).json(error(`The username '${response.payload.username}' is taken.`));
            break;
    }
});

usersController.post('/login', async (req, res) => {
    const userLogin = validate(userLoginSchema, req.body);
    const response = await handleUserLogin(getManager(), userLogin);
    switch (response.type) {
        case 'success':
            res.status(200).json(user(response));
            break;
        case 'passwordIncorrect':
            res.status(401).json(error('password is incorrect'));
            break;
        case 'userDoesNotExist':
            res.status(404).json(error('user does not exist'));
            break;
    }
});

usersController.put('/', auth.required, async (req, res) => {
    const userUpdate = validate(userUpdateSchema, req.body);
    const response = await handleUserUpdate(
        req.user,
        getManager(),
        userUpdate,
    );
    switch(response.type) {
        case 'success':
            res.status(200).json(user(response));
            break;
    }
})

function user({ payload }: { payload: UserResponse }) {
    return { user: payload };
}

function error(...errors: string[]) {
    return {
        errors: { body: errors }
    };
}

export {
    usersController
};
