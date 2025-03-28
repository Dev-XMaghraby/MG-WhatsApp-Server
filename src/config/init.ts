import { mkdirSync } from "fs";
import { Utils } from "../utils/utils";
//IMPROVE: error handler
export function initialize(){
    if (!Utils.checkFile(Utils.STATIC_PATH).existance) {
        mkdirSync(Utils.STATIC_PATH);
    }
    if (!Utils.checkFile(Utils.STATIC_PATH + "/auth").existance) {
        mkdirSync(Utils.STATIC_PATH + "/auth")
    }
}