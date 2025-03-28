import express from 'express'
import cors from 'cors'
import { Logger } from '../utils/logger';
import { Controller } from '../models';
import {createServer} from 'http'
export class HttpService {
    private static instance: HttpService;
    private app;
    private logger = Logger.getInstance().log;
    private server;
    private constructor(){
        this.app = express();
        this.server = createServer(this.app);
        this.init()
    }
    static getServer(): HttpService{
        if (!this.instance) {
            this.instance = new HttpService();
        }
        return this.instance;
    }
    private init(){
        this.app.use(express.json());
        this.app.use(cors());
        this.start();
    }
    private start(){
        this.server.listen(3131, () => {
            this.logger("Server started on port localhost:3131 ...")
        })
    }
    public getServer(){
        return this.server;
    }
    public addController(controller: Controller) {
        const { type, path, middlewares = [], callback } = controller;
        // Validate the HTTP method type
        if (!["get", "put", "post", "delete"].includes(type)) {
            this.logger(`Invalid controller type: ${type}`, "error");
            return;
        }
        // Dynamically register the route with middleware support
        this.app[type](path, ...middlewares, callback);
    }
}

