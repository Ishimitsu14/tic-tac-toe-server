import { Request, Response } from "express";
import isAuth from "@middleware/isAuth";

export = {
    '/': {
        get: [isAuth, async (req: Request, res: Response) => {
            res.json({ user: req.user })
        }]
    }
}