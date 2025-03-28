"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("./config/init");
const express_1 = require("./connection/express");
const socket_1 = require("./connection/socket");
const whatsapp_1 = require("./connection/whatsapp");
const ControllerFactory_1 = require("./controllers/ControllerFactory");
const logger_1 = require("./utils/logger");
const utils_1 = require("./utils/utils");
const prefs_1 = require("./config/prefs");
function main(bot) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield bot.start();
        }
        catch (error) {
            const logger = logger_1.Logger.getInstance();
            logger.error(error);
            logger.log("Error happened, restarting after 5 seconds...");
            yield utils_1.Utils.delay(5);
            yield main(new MaghrabyBot);
        }
    });
}
class MaghrabyBot {
    constructor() {
        (0, init_1.initialize)();
        this.prefs = prefs_1.Prefs.getInstance();
        this.logger = logger_1.Logger.getInstance();
        this.server = express_1.HttpService.getServer();
        this.whatsapp = whatsapp_1.WhatsAppConnection.getInstance();
        this.io_server = socket_1.IOServer.getInstance();
        this.io_server.init(this.server.getServer());
    }
    /**@overrides */
    onUpdateMessage(message) {
        this.io_server.emit('msg', message);
        if (this.whatsapp.getMessageType(message) === "status") {
            if (!message.messageStubType && this.prefs.getPref("settings")["auto_status"] && !message.key.fromMe) {
                const random_emoji = utils_1.Utils.getRandomEmoji();
                (() => __awaiter(this, void 0, void 0, function* () { yield this.whatsapp.sendStatusReaction(message, random_emoji); }))();
                this.logger.log("reacting with " + random_emoji);
            }
        }
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.whatsapp.init();
            this.whatsapp.addObserver(this);
            const controller_factory = new ControllerFactory_1.ControllerFactory();
            const logController = controller_factory.creteController("logger");
            const testController = controller_factory.creteController("test");
            const authController = controller_factory.creteController("code");
            const msgController = controller_factory.creteController("message");
            this.server.addController(logController);
            this.server.addController(testController);
            this.server.addController(authController);
            this.server.addController(msgController);
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.init();
            this.logger.log("Maghraby bot started...");
        });
    }
}
main(new MaghrabyBot());
