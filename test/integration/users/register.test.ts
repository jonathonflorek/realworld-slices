import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { getRepository } from 'typeorm';
import { UserEntity } from '../../../src/models/UserEntity';
import { app } from '../../../src';
import { OK, UNPROCESSABLE_ENTITY } from 'http-status-codes'

chai.use(chaiHttp);
const { expect } = chai;

describe('Endpoint test for users: POST /users', () => {
    const USERS_ENDPOINT = '/api/users';

    it('GIVEN a valid registration, ' +
        'WHEN posting to users endpoint, ' +
        'THEN a Response with HTTP STATUS OK and the created user.',
        async () => {

        // Arrange

        const registration = {
            user: {
                username: 'John F Doe',
                email: 'sample.user@mydomain.com',
                password: 'Hp6V.M/5$mE:$?]H',
            },
        };

        // Act

        const registrationResult = await chai
            .request(app)
            .post(USERS_ENDPOINT)
            .send(registration);
        const token = registrationResult.body?.user?.token;
        const authorizedEndpointResult = await chai
            .request(app)
            .get(USERS_ENDPOINT)
            .auth(token, { type: 'bearer' })
            .send();

        // Assert

        expect(registrationResult, 'registration result status not OK').to.have.status(OK);
        expect(registrationResult.body?.user).to.include({
            email: 'sample.user@mydomain.com',
            username: 'John F Doe',
            bio: '',
            image: '',
        });
        expect(authorizedEndpointResult, 'authorized result status not OK').to.have.status(OK);
    });

    it('GIVEN a registration for an already existing username, ' +
        'WHEN posting to users endpoint, ' +
        'THEN a Response with HTTP UNPROCESSABLE ENTITY and an informative error.',
        async () => {
        
        // Arrange

        const userRepo = getRepository(UserEntity);
        await userRepo.insert({
            username: 'John F Doe',
            email: 'sample.user@mydomain.com',
            bio: '',
            image: '',
            salt: '',
            hash: '',
        });

        const registration = {
            user: {
                username: 'John F Doe',
                email: 'sample.user@mydomain.com',
                password: 'Hp6V.M/5$mE:$?]H',
            },
        };

        // Act

        const result = await chai
            .request(app)
            .post(USERS_ENDPOINT)
            .send(registration);

        // Assert

        expect(result).to.have.status(UNPROCESSABLE_ENTITY);
        expect(result.body).to.deep.include({
            errors: {
                body: [
                    `The username 'John F Doe' is taken.`,
                ],
            },
        });
    });
});
