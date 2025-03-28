import { Request, Response, NextFunction } from "express";
import { Controller } from "../models";

export class TestController implements Controller{
    type: "get" | "put" | "post" | "delete";
    path: string;
    middlewares?: ((req: Request, res: Response, next: NextFunction) => void)[] | undefined;
    callback: (req: Request, res: Response, next?: NextFunction) => void;
    metadata?: Record<string, any> | undefined;
    constructor(){
        this.type = "get";
        this.path = "/ping";
        this.callback = (_req, res) => {
            res.status(200).send("pong!")
        }
    }
}