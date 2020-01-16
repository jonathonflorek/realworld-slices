import { Primitive } from 'validate-typescript';
import { resultFactory } from '../../util';
import { ArticleEntity } from '../../models/ArticleEntity';
import { CurrentUser } from '../../types';
import * as slug from 'slug';
import { EntityManager } from 'typeorm';
import { UserEntity } from '../../models/UserEntity';

export const articlePostSchema = {
    article: {
        title: Primitive(String),
        description: Primitive(String),
        body: Primitive(String),
        tagList: [Primitive(String)],
    },
};

interface ArticlePostResults {
    success: {
        article: ArticleDto;
    };
}

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

const result = resultFactory<ArticlePostResults>();

export async function handleArticlePost(
    currentUser: CurrentUser,
    manager: EntityManager,
    articlePost: typeof articlePostSchema,
) {
    const now = new Date();
    const author = await manager.findOne(UserEntity, { id: currentUser.id });
    if (author === undefined) {
        throw new Error(`current user does not exist`);
    }

    const data = articlePost.article;
    const article = new ArticleEntity();
    article.title = data.title;
    article.description = data.description;
    article.slug = getSlug(data.title);
    article.tagList = data.tagList;
    article.author = author;
    article.created = now;
    article.updated = now;

    await manager.save(article);

    return result('success', {
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
