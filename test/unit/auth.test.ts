import { getTokenFromHeader } from '../../src/auth';
import { createRequest } from 'node-mocks-http';
import { expect } from 'chai';

describe('Unit test for auth.ts', () => {
    it('GIVEN a valid bearer auth header, ' +
        'WHEN extracting the token from the header, ' +
        'THEN the token is extracted',
        () => {
        
            // Arrange

            const authorization = 'Bearer MY.123_token';
            const request = createRequest({ headers: { authorization } })

            // Act

            const token = getTokenFromHeader(request);

            // Assert

            expect(token).to.equal('MY.123_token');
        });
});
