//IMPROVE: handle errors
import { WAMessage } from "baileys";
import { initialize } from "./config/init";
import { HttpService } from "./connection/express";
import { IOServer } from "./connection/socket";
import { WhatsAppConnection } from "./connection/whatsapp";
import { ControllerFactory } from "./controllers/ControllerFactory";
import { Controller, MessageHandler } from "./models";
import { Logger } from "./utils/logger";
import { Utils } from "./utils/utils";
import { Prefs } from "./config/prefs";
async function main(bot: MaghrabyBot) {
    try {
        await bot.start();
    } catch (error) {
        const logger = Logger.getInstance();
        logger.error(error as Error);
        logger.log("Error happened, restarting after 5 seconds...");
        await Utils.delay(5);
        await main(new MaghrabyBot);
    }
}
class MaghrabyBot implements MessageHandler{
    private whatsapp: WhatsAppConnection;
    private io_server: IOServer;
    private server: HttpService;
    private logger: Logger;
    private prefs: Prefs;
    constructor(){
        initialize();
        this.prefs = Prefs.getInstance();
        this.logger = Logger.getInstance();
        this.server = HttpService.getServer();
        this.whatsapp = WhatsAppConnection.getInstance();
        this.io_server = IOServer.getInstance();
        this.io_server.init(this.server.getServer());
    }
    /**@overrides */
    onUpdateMessage(message: WAMessage): void {
        this.io_server.emit('msg', message);
        if (this.whatsapp.getMessageType(message) === "status") {
            if (!message.messageStubType && this.prefs.getPref("settings")["auto_status"] && !message.key.fromMe) {
                const random_emoji = Utils.getRandomEmoji();
                (async () => {await this.whatsapp.sendStatusReaction(message, random_emoji)})();
                this.logger.log("reacting with " + random_emoji)
            }
        }
    }
    private async init(){
        await this.whatsapp.init();
        this.whatsapp.addObserver(this);
        const controller_factory = new ControllerFactory();
        const logController: Controller = controller_factory.creteController("logger");
        const testController: Controller = controller_factory.creteController("test");
        const authController: Controller = controller_factory.creteController("code");
        const msgController: Controller = controller_factory.creteController("message")
        this.server.addController(logController);
        this.server.addController(testController);
        this.server.addController(authController);
        this.server.addController(msgController);
    }
    public async start(){
        await this.init();
        this.logger.log("Maghraby bot started...");
    }
}
main(new MaghrabyBot());