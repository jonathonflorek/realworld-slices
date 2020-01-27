import { Router } from 'express';
import { auth } from '../../auth';
import { get } from './get';
import { register } from './register';
import { login } from './login';
import { update } from './update';

const usersController = Router();

usersController.get('/', auth.required, get);
usersController.post('/', register);
usersController.post('/login', login);
usersController.put('/', auth.required, update);

export { usersController };
