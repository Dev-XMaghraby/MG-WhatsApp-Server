import { Request, Response, NextFunction } from 'express';
import { Controller } from './../models';
import { WhatsAppConnection } from '../connection/whatsapp';
import { Logger } from '../utils/logger';
export class AuthController implements Controller{
    private whatsapp: WhatsAppConnection;
    private logger = Logger.getInstance();
    type: 'get' | 'put' | 'post' | 'delete';
    path: string;
    middlewares?: ((req: Request, res: Response, next: NextFunction) => void)[] | undefined;
    callback: (req: Request, res: Response, next?: NextFunction) => void;
    metadata?: Record<string, any> | undefined;
    constructor(){
        this.whatsapp = WhatsAppConnection.getInstance();
        this.type = 'get';
        this.path = "/code/:phone";
        this.callback = async (req, res) => {
            const phone = req.params.phone;
            if (!phone) {
                return res.status(404).json({state: false, reason: "phone number not found"});
            }
            const code = await this.whatsapp.conncetWithCode(phone);
            if (!code) {
                this.logger.log("Couldn't get code from whatsapp", "error");
                return res.status(500).json({state: false, reason: "Whatsapp server error"});
            }
            res.status(200).json({state: true, code});
        }
    }
}