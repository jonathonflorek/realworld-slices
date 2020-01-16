import 'reflect-metadata';
import * as express from 'express';
import { apiController } from './features/routes';
import { createConnection } from 'typeorm';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { postgresConfig } from './config';

const app = express();
const running = start(app);

async function start(app: express.Application) {
    await createConnection({
        ...postgresConfig,
        entities: ['dist/models/*.js'],
        migrations: ['dist/migrations/*.js'],
        migrationsRun: true,
    });

    app.use(cors());
    app.use(bodyParser.json());

    app.use('/api', apiController);

    await new Promise(resolve => {
        app.listen(8080, () => {
            console.log(`application listening on port 8080...`);
            resolve();
        });
    });
}

export {
    app,
    running,
};
