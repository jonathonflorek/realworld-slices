// load our server configuration variables from our .env file
require('dotenv').config();

module.exports = {
    type: 'postgres',
    entities: ['dist/models/*.js'],
    migrations: ['dist/migrations/*.js'],
    cli: {
        entitiesDir: 'src/models',
        migrationsDir: 'src/migrations',
    },

    port: Number(process.env.POSTGRES_PORT),
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
};
