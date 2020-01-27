import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { app } from '../../src';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes'

chai.use(chaiHttp);
const { expect } = chai;

describe('Debug endpoint test for errors: GET /error', () => {
    const ERROR_ENDPOINT = '/api/error';

    it('GIVEN an endpoint, ' +
        'WHEN an internal error is thrown, ' +
        'THEN a Response with HTTP STATUS INTERNAL SERVER ERROR',
        async () => {

            // Act

            const result = await chai
                .request(app)
                .get(ERROR_ENDPOINT)
                .send();
            
            // Assert

            expect(result).to.have.status(INTERNAL_SERVER_ERROR);

        });
});
