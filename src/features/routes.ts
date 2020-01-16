import { Router } from 'express';
import { usersController } from './users/usersController';
import { articlesController } from './articles/articlesController';

const apiController = Router();

apiController.use('/users', usersController);
apiController.use('/articles', articlesController);

export { apiController };
