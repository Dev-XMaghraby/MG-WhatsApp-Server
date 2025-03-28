import { Request, Response, NextFunction } from "express";
import { Controller } from "../models";
import { WhatsAppConnection } from "../connection/whatsapp";

export class MessageController implements Controller{
    private whatsapp: WhatsAppConnection;
    type: "get" | "put" | "post" | "delete" = "post";
    path: string = "/send/:phone";
    callback: (req: Request, res: Response, next?: NextFunction) => void = async (req, res) => {
        const phone = req.params.phone;
        const {msg} = req.body;
        if (!phone || !msg) {
            return res.status(404).json({state: false});
        }
        await this.sendMessage(phone, msg);
        return res.status(200).json({state: true})
    };
    constructor(){
        this.whatsapp = WhatsAppConnection.getInstance();
    }
    async sendMessage(phone: string, msg: string){
        const state = await this.whatsapp.sendTextMessage(phone, msg);
    }
    metadata?: Record<string, any> | undefined;

}