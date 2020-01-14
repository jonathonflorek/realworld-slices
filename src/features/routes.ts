import { Router } from 'express';
import { usersController } from './users/usersController';

const apiController = Router();

apiController.use('/users', usersController);

export { apiController };
