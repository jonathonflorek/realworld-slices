import { Router } from 'express';
import { auth } from '../../auth';
import { post } from './post';

const articlesController = Router();

articlesController.get('/', async (req, res) => {
    res.status(200).send({
        articles: [],
    });
});

articlesController.post('/', auth.required, post);

export { articlesController };
