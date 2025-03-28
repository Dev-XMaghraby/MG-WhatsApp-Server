import path from "path";
import P from "pino";
import { Utils } from "./utils";
import "colors";

export class Logger {
    private static instance: Logger | null = null;
    private logger: P.Logger;

    // Private constructor ensures singleton pattern
    private constructor() {
        this.logger = P(
            { level: "info" },
            P.destination({
                dest: path.resolve(Utils.STATIC_PATH, "logs.json"),
                sync: false,
            })
        );
    
        // Bind the log method to the current instance
        this.log = this.log.bind(this);
    }

    // Singleton instance getter
    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    /**
     * Logs data with optional type specification.
     * @param data - The data to log.
     * @param typ - The type of log ("normal", "warn", "error").
     */
    public log(data: any, typ: "normal" | "warn" | "error" = "normal"): void {
        const logMethods: Record<string, [P.LogFn, string]> = {
            normal: [this.logger.info.bind(this.logger), "Log: ".green],
            warn: [this.logger.warn.bind(this.logger), "Warning: ".yellow],
            error: [this.logger.error.bind(this.logger), "Error: ".red],
        };

        const [loggerMethod, consolePrefix] = logMethods[typ];
        loggerMethod(data);
        console.log(consolePrefix, data);
    }

    /**
     * Logs informational messages.
     * @param data - The data to log.
     */
    public info(data: object): void {
        this.logger.info(data);
    }

    /**
     * Logs warning messages.
     * @param data - The data to log.
     */
    public warn(data: object): void {
        this.logger.warn(data);
    }

    /**
     * Logs error messages.
     * @param data - The data to log.
     */
    public error(data: object): void {
        this.logger.error(data);
    }
}