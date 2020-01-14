import 'reflect-metadata';
import * as express from 'express';
import { apiController } from './features/routes';
import { createConnection } from 'typeorm';
import { UserEntity } from './models/UserEntity';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

async function run() {
    await createConnection({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [UserEntity],
        synchronize: true,
        logging: false,
    })

    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    app.use('/api', apiController);

    app.listen(8080, () => {
        console.log(`application listening on port 8080...`);
    });
}

run();
