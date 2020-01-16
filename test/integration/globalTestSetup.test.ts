import { getRepository } from 'typeorm';
import { UserEntity } from '../../src/models/UserEntity';
import { running } from '../../src';

before(async () => {
    await running;
})

afterEach(async () => {
    // Clean Repositories after each test
    getRepository(UserEntity).clear();
});
