import { Logger } from "./logger"

export type ErrorData = {
    level: "expected" | "unexpected" | "normal" | "ignore",
    error: any,
    date: string
}
const logger = Logger.getInstance();

export function handleError(err: ErrorData){
    //TODO: Handle all Errors
    logger.log(err, "error");
    if (err.level === "unexpected") {
        process.exit(1)
    }
}