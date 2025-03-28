import { Request, Response, NextFunction } from "express";
import { Controller } from "../models";
import { Prefs } from "../config/prefs";
//TESTME
export class SettingsController implements Controller{
    private prefs = Prefs.getInstance();
    type: "get" | "put" | "post" | "delete";
    path: string;
    middlewares?: ((req: Request, res: Response, next: NextFunction) => void)[] | undefined;
    callback: (req: Request, res: Response, next?: NextFunction) => void;
    metadata?: Record<string, any> | undefined;
    constructor(){
        this.type = "post";
        this.path = "/set"
        this.callback = (req, res) => {
            const {data} = req.body;
            if (!data) {
                return res.status(404).json({state: false, reason: "No data found"});
            }
            const {type, key, val} = data;
            if (type === "settings") {
                this.prefs.putSetting(key, val);
            }else{
                this.prefs.putPref(key, val);
            }
            res.status(200).json({state: true})
        }
    }
}