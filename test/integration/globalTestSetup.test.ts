import { getRepository } from 'typeorm';
import { UserEntity } from '../../src/models/UserEntity';
import { running } from '../../src';

before(async () => {
    // ensure our app is fully armed and operational before running tests
    await running;
})

afterEach(async () => {
    // Clean Repositories after each test
    getRepository(UserEntity).clear();
});
