import { Request, Response, NextFunction } from "express";
import { Controller } from "../models";
import { Logger } from "../utils/logger";

export class ReqLogger implements Controller{
    private logger: Logger;
    type: "get" | "put" | "post" | "delete";
    path: string;
    middlewares?: ((req: Request, res: Response, next: NextFunction) => void)[] | undefined;
    callback: (req: Request, res: Response, next?: NextFunction) => void;
    metadata?: Record<string, any> | undefined;
    constructor() {
        this.type = "get";
        this.path = "*";
        this.logger = Logger.getInstance();
        this.callback = (req: Request, _res: Response, next?: NextFunction) => {
            this.logger.log(`req: ${req.method} | ${req.path}`);
            if (next) {
                next();
            }
        };
    }
}