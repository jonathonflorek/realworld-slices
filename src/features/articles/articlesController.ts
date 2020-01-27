import { Router } from 'express';
import { auth } from '../../auth';
import { post } from './post';
import { recent } from './recent';

const articlesController = Router();

articlesController.get('/', recent);
articlesController.post('/', auth.required, post);

export { articlesController };
