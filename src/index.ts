import * as express from 'express';
import { usersController } from './features/users/usersController';

const app = express();
app.use(usersController);

app.listen(8080, () => {
    console.log(`application listening on port 8080...`);
});
