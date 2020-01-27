import { Primitive, validate } from 'validate-typescript';
import { ArticleEntity } from '../../models/ArticleEntity';
import * as slug from 'slug';
import { getManager } from 'typeorm';
import { UserEntity } from '../../models/UserEntity';
import { Request, Response } from 'express';

export const articlePostSchema = {
    article: {
        title: Primitive(String),
        description: Primitive(String),
        body: Primitive(String),
        tagList: [Primitive(String)],
    },
};

interface ArticleDto {
    slug: string;
    title: string;
    description: string;
    body: string;
    tagList: string[];
    createdAt: Date;
    updatedAt: Date;
    favorited: boolean;
    favoritesCount: number;
    author: ProfileDto;
}

interface ProfileDto {
    username: string;
    bio: string;
    image: string;
    following: boolean;
}

export async function post(req: Request, res: Response) {
    const currentUser = req.user;
    const articlePost = validate(articlePostSchema, req.body);
    const manager = getManager();

    const now = new Date();
    const author = await manager.findOne(UserEntity, { id: currentUser.id });
    if (author === undefined) {
        throw new Error(`current user does not exist`);
    }

    const data = articlePost.article;
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

function getArticleDto(entity: ArticleEntity): ArticleDto {
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

function getProfileDto(user: UserEntity): ProfileDto {
    return {
        username: user.username,
        bio: user.bio,
        image: user.image,
        following: false,
    };
}
