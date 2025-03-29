import { Request, Response, NextFunction } from "express";
import { Controller } from "../models";
import { Gemini } from "../connection/gemini";

export class GeminiController implements Controller{
    private gemini: Gemini = Gemini.getInstance();
    type: "get" | "put" | "post" | "delete";
    path: string;
    middlewares?: ((req: Request, res: Response, next: NextFunction) => void)[] | undefined;
    callback: (req: Request, res: Response, next?: NextFunction) => void;
    metadata?: Record<string, any> | undefined;
    constructor(){
        this.type = "get";
        this.path = "/ai/:message";
        this.callback = async (req, res) => {
            const message: string = req.params.message;
            if (!message) {
                return res.status(404).json({state: false, res: undefined, reason: "No message Found"});
            }
            const ai_res = await this.gemini.getResponse(message);
            if (ai_res) {
                res.status(200).json({state: true, res: ai_res});
            }else{
                res.status(500).json({state: false, reason: "Unknown Error"});
            }
        }
    }
}