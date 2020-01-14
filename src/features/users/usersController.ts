import { Router } from 'express';

export const usersController = Router();

usersController.get('/', (req, res) => {
    res.json({ message: 'hello world' });
});
