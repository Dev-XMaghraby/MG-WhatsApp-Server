import { Controller } from "../models";
import { AuthController } from "./Authcontroller";
import { MessageController } from "./MessageController";
import { ReqLogger } from "./ReqLogger";
import { TestController } from "./TestController";

export type Controllers = "test" | "logger" | "message" | "settings" | "code"

export class ControllerFactory{
    creteController(name: Controllers): Controller{
        switch (name) {
            case "logger":
                return new ReqLogger();
            case "message":
                return new MessageController();
            case "test":
                return new TestController();
            case "code": 
                return new AuthController();
            default:
                return new ReqLogger();
        }
    }
}