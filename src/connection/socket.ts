import { createServer } from 'http';
import { Server } from 'socket.io';
import { Logger } from '../utils/logger';
import { IOController } from '../models';

export class IOServer{
    private static instance: IOServer;
    private server: ReturnType<typeof createServer> | null = null;
    private io: Server | null = null;
    private isInitialized: boolean = false;
    private clients = 0;
    private logger = Logger.getInstance();
    private constructor(){}
    static getInstance(): IOServer{
        if (!this.instance) {
            this.instance = new IOServer();
        }
        return this.instance
    }
    public shouldInit(): boolean{
        return !this.isInitialized || this.server === null || this.io === null
    }
    public init(server: ReturnType<typeof createServer>){
        if (this.shouldInit()) {
            this.server = server;
            this.io = new Server(server, {
                cors: {
                    origin: "*",
                    methods: ["GET", "POST"]
                }
            });
            this.io.on('connection', () => {
                this.logger.log("New client connected...");
                this.clients++;
            });
            this.io?.on('disconnect', () =>{
                this.clients--;
            });
        }
    }
    public addController(controller: IOController){
        if (!this.shouldInit()) {
            this.io?.on(controller.event, controller.onData)
        }
    }
    public emit(ev: string, data: any){
        if (!this.shouldInit()) {
            this.io?.emit(ev, data);
        }
    }
}