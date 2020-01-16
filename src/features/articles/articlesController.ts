import { Router } from 'express';
import { auth } from '../../auth';
import { validate } from 'validate-typescript';
import { articlePostSchema, handleArticlePost } from './post';
import { getManager } from 'typeorm';

const articlesController = Router();

articlesController.get('/', async (req, res) => {
    res.status(200).send({
        articles: [],
    });
});

articlesController.post('/', auth.required, async (req, res) => {
    const articlePost = validate(articlePostSchema, req.body);
    const postResult = await handleArticlePost(
        req.user,
        getManager(),
        articlePost,
    );
    switch (postResult.type) {
        case 'success':
            res.status(200).send(postResult.payload);
            break;
    }
});

export { articlesController };
