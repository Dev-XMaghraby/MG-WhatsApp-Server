import { WAMessage } from "baileys";
import { initialize } from "./config/init";
import { HttpService } from "./connection/express";
import { IOServer } from "./connection/socket";
import { WhatsAppConnection } from "./connection/whatsapp";
import { ControllerFactory, Controllers } from "./controllers/ControllerFactory";
import { Controller, MessageHandler } from "./models";
import { Logger } from "./utils/logger";
import { Utils } from "./utils/utils";
import { Prefs } from "./config/prefs";
import { handleError } from "./utils/error";
async function main(bot: MaghrabyBot) {
    try {
        await bot.start();
    } catch (error) {
        handleError({error, date: Utils.getFormattedDate(), level:"expected"});
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
        const contrller_names: Controllers[] = ['logger', 'test', 'code', 'message', 'ai'];
        const controller_factory = new ControllerFactory();
        for (const name of contrller_names) {
            const controller: Controller = controller_factory.creteController(name);
            this.server.addController(controller);
        }
    }
    public async start(){
        await this.init();
        this.logger.log("Maghraby bot started...");
    }
}
main(new MaghrabyBot());