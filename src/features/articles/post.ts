import { ArticleEntity } from '../../models/ArticleEntity';
import * as slug from 'slug';
import { getManager } from 'typeorm';
import { UserEntity } from '../../models/UserEntity';
import { Request, Response } from 'express';

import * as t from 'io-ts';
import { either } from 'fp-ts';
import { failure } from 'io-ts/lib/PathReporter'

const ArticlePost = t.strict({
    article: t.strict({
        title: t.string,
        description: t.string,
        body: t.string,
        tagList: t.array(t.string),
    }),
});

export async function post(req: Request, res: Response) {
    const currentUser = req.user;
    const manager = getManager();

    const articlePost = ArticlePost.decode(req.body);

    if (either.isLeft(articlePost)) {
        return res.status(422).json({
            errors: { body: failure(articlePost.left) },
        });
    }

    const now = new Date();
    const author = await manager.findOne(UserEntity, { id: currentUser.id });
    if (author === undefined) {
        throw new Error(`current user does not exist`);
    }

    const data = articlePost.right.article;
    const article = new ArticleEntity();
    article.title = data.title;
    article.description = data.description;
    article.body = data.body;
    article.slug = getSlug(data.title);
    article.tagList = data.tagList;
    article.author = author;
    article.created = now;
    article.updated = now;

    await manager.save(article);

    return res.status(200).json({
        article: getArticleDto(article),
    });
}

function getSlug(title: string) {
    return slug(title, {lower: true}) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
}

function getArticleDto(entity: ArticleEntity) {
    return {
        slug: entity.slug,
        title: entity.title,
        description: entity.description,
        body: entity.body,
        tagList: entity.tagList,
        createdAt: entity.created,
        updatedAt: entity.updated,
        favorited: false,
        favoritesCount: 0,
        author: getProfileDto(entity.author),
    };
}

function getProfileDto(user: UserEntity) {
    return {
        username: user.username,
        bio: user.bio,
        image: user.image,
        following: false,
    };
}
