import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { getRepository } from 'typeorm';
import { app } from '../../../src';
import { OK } from 'http-status-codes'
import { ArticleEntity } from '../../../src/models/ArticleEntity';
import { loadSampleUserAndLogin } from '../util';

chai.use(chaiHttp);
const { expect } = chai;

describe('Endpoint test for articles: POST /articles', () => {
    const ARTICLES_ENDPOINT = '/api/articles';

    it('GIVEN a valid article, ' +
        'WHEN posting to articles endpoint, ' +
        'THEN a Response with HTTP STATUS OK and created article, ' +
        'and created article in database',
        async () => {

            // Arrange

            const article = {
                article: {
                    title: 'Integration testing 101',
                    description: 'How to perform integration tests with mocha + chai',
                    body: 'This article discusses testing with an example implementation of the Realworld.io backend API. Lorem ipsum etcetera etcetera etcetera.',
                    tagList: ['test', 'testing', 'integration'],
                },
            };

            const token = await loadSampleUserAndLogin(
                'username',
                'username@realworld.io'
            );

            // Act

            const result = await chai
                .request(app)
                .post(ARTICLES_ENDPOINT)
                .auth(token, { type: 'bearer' })
                .send(article);
            
            const allArticles = await getRepository(ArticleEntity).find({ relations: ['author'] });

            // Assert

            expect(result).to.have.status(OK);
            expect(result.body?.article).to.deep.include({
                title: 'Integration testing 101',
                description: 'How to perform integration tests with mocha + chai',
                body: 'This article discusses testing with an example implementation of the Realworld.io backend API. Lorem ipsum etcetera etcetera etcetera.',
                tagList: ['test', 'testing', 'integration'],
            });
            expect(allArticles).to.have.lengthOf(1)
            expect(allArticles[0]).to.deep.include({
                title: 'Integration testing 101',
                description: 'How to perform integration tests with mocha + chai',
                body: 'This article discusses testing with an example implementation of the Realworld.io backend API. Lorem ipsum etcetera etcetera etcetera.',
                tagList: ['test', 'testing', 'integration'],
            });
            expect(allArticles[0].author).to.include({
                username: 'username',
                email: 'username@realworld.io',
            });
        });
});
