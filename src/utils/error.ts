import { Logger } from "./logger"

export type ErrorData = {
    level: "expected" | "unexpected" | "normal" | "ignore",
    error: any,
    date: string
}
const logger = Logger.getInstance();

export function handleError(err: ErrorData){
    logger.log(err, "error");
    // Log additional error details
    if (err.error instanceof Error) {
        logger.log({
            message: err.error.message,
            stack: err.error.stack,
            name: err.error.name
        }, "error");
    }
    if (err.level === "unexpected") {
        process.exit(1)
    }
}