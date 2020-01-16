import { getRepository, getManager } from 'typeorm';
import { UserEntity } from '../../src/models/UserEntity';
import { running } from '../../src';
import { ArticleEntity } from '../../src/models/ArticleEntity';

before(async () => {
    // ensure our app is fully armed and operational before running tests
    await running;
})

afterEach(async () => {
    // Clean Repositories after each test
    // typeORM does not support repository.clear() on Postgres tables
    // (see https://github.com/typeorm/typeorm/issues/1649), so we manually
    // apply the CASCADE rule here.
    await getManager().query(`TRUNCATE TABLE "user" CASCADE`);
    await getManager().query(`TRUNCATE TABLE "article" CASCADE`);
});
