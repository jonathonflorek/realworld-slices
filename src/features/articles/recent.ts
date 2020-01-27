import { Request, Response } from 'express';

export async function recent(req: Request, res: Response) {
    return res.status(200).send({
        articles: [],
    });
}
