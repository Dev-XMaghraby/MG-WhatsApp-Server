import { WAMessage } from "baileys"
import { NextFunction, Request, Response } from "express"
export type PREFS_TYPE = Partial<typeof default_prefs>
export const default_prefs = {
    name: "User",
    version: "0.0.01",
    settings: {
        auto_status: false,
    }
}
export interface WhatsAppSubject{
    addObserver(obs: MessageWorker): void
    removeObserver(obs: MessageWorker): void
    updateMessages(message: WAMessage): void
}
export interface MessageWorker{
    onUpdateMessage(message: WAMessage): void
}
export class MessageHandler implements MessageWorker{
    onUpdateMessage(message: WAMessage): void {
        console.log(message);
    } 
}
export class WaSocket implements WhatsAppSubject{
    public observers: MessageWorker[] = [];
    addObserver(obs: MessageWorker): void {
        this.observers.push(obs);
    }
    removeObserver(obs: MessageWorker): void {
        const index = this.observers.indexOf(obs);
        index != 1 && this.observers.splice(index, 1);
    }
    updateMessages(message: WAMessage): void {
        throw new Error("Method not implemented.")
    }
}
export interface Controller {
    type: "get" | "put" | "post" | "delete"; // HTTP method
    path: string; // Route path (supports dynamic parameters like /users/:id)
    middlewares?: ((req: Request, res: Response, next: NextFunction) => void)[]; // Optional middleware array
    callback: (req: Request, res: Response, next?: NextFunction) => void; // Main route handler
    metadata?: Record<string, any>; // Optional metadata for documentation or other purposes
}
export interface IOController {
    event: string,
    onData: (data: any) => void;
}