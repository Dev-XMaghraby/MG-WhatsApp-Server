import makeWASocket, { Browsers, DisconnectReason, jidDecode, useMultiFileAuthState, WAMessage } from "baileys";
import { WaSocket } from "../models";
import P from 'pino'
import { Utils } from "../utils/utils";
import { handleError } from "../utils/error";
import { Boom } from "@hapi/boom";
import { Logger } from "../utils/logger";

export class WhatsAppConnection extends WaSocket {
    private mLogger: Logger = Logger.getInstance();
    private static instance: WhatsAppConnection;
    private waSocket: ReturnType<typeof makeWASocket> | null = null
    public isOnline: boolean = false;
    private lasMessageID = ""
    private constructor() {
        super();
    }
    static getInstance(): WhatsAppConnection {
        if (!this.instance) {
            this.instance = new WhatsAppConnection();
        }
        return this.instance;
    }
    async init() {
        this.mLogger.log("initializing WhatsApp...")
        try {
            //TODO: use a database instead
            const { state, saveCreds } = await useMultiFileAuthState(Utils.STATIC_PATH + "/auth");
            const logger = P({ level: "silent" });
            this.waSocket = makeWASocket({
                auth: state,
                logger,
                browser: Browsers.macOS("Safari"),
                printQRInTerminal: false,
                keepAliveIntervalMs: 10_000,
            });
            this.waSocket.ev.on('connection.update', async (update) => {
                const { lastDisconnect, connection, isOnline } = update;
                this.isOnline = isOnline ? isOnline : false;
                this.mLogger.log("connection updated..");
                if (lastDisconnect) {
                    const shouldReconnect = (lastDisconnect?.error as Boom).output || (lastDisconnect?.error as Boom).output?.statusCode !== DisconnectReason.loggedOut;
                    if (shouldReconnect || !isOnline) {
                        //TODO: Log
                        //BUG
                        await this.init();
                    }
                }
                this.waSocket?.ev.on('messages.upsert', (messages) => {
                    this.updateMessages(messages.messages[0]);
                })
                switch (connection) {
                    case "close": {
                        this.mLogger.log("Disconnected..", "warn")
                        break;
                    }
                    case "open": {
                        this.mLogger.log("Connected...")
                        break;
                    }
                }
            })
            this.waSocket.ev.on('creds.update', saveCreds);
        } catch (error) {
            handleError({ error, date: Utils.getFormattedDate(), level: "expected" });
            this.mLogger.log("something wrong happend, reconnecting", "error");
            await this.init();
        }
    }
    async conncetWithCode(phone: string) {
        if (this.waSocket != null) {
            try {
                const code = await this.waSocket.requestPairingCode(phone);
                return code;
            } catch (error) {
                handleError({ error, date: Utils.getFormattedDate(), level: "expected" });
            }
        }
    }
    private decodeJid(jid?: string | null): string | null {
        if (!jid) return null
        if (/:\d+@/gi.test(jid)) {
            const decode = jidDecode(jid) || { server: undefined, user: undefined }
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }
    async sendStatusReaction(message: WAMessage, emoji: string) {
        try {
            const jid = this.decodeJid(this.waSocket?.user?.id);
            if (jid && message && message.key && message.key.remoteJid && message.key.participant) {
                const msg = await this.waSocket?.sendMessage(message.key.remoteJid, {
                    react: {
                        text: emoji,
                        key: message.key
                    },
                    
                }, {statusJidList: [message.key.participant, jid]});
                return msg
            } else {
                throw new Error("Jid not found");
            }
        } catch (error) {
            handleError({ error, date: Utils.getFormattedDate(), level: "unexpected" });
        }
    }
    async sendTextMessage(phone: string, message: string) {
        try {
            const jid = `${phone}@s.whatsapp.net`;
            const msg = await this.waSocket?.sendMessage(jid, { text: message });
            return msg
        } catch (error) {
            handleError({ error, date: Utils.getFormattedDate(), level: "unexpected" });
        }
    }
    async sendAudioMessage(phone: string, audioPath: string) {
        try {
            const jid = `${phone}@s.whatsapp.net`;
            const msg = await this.waSocket?.sendMessage(jid, {
                audio: { url: audioPath },
                mimetype: 'audio/mp4'
            });
            return msg
        } catch (error) {
            handleError({ error, date: Utils.getFormattedDate(), level: "unexpected" });
        }
    }
    async sendDocMessage(phone: string, docPath: string) {
        try {
            const jid = `${phone}@s.whatsapp.net`;
            const msg = await this.waSocket?.sendMessage(jid, {
                document: { url: docPath },
                mimetype: 'application/octet-stream'
            });
            return msg
        } catch (error) {
            handleError({ error, date: Utils.getFormattedDate(), level: "unexpected" });
        }
    }
    async sendImageMessage(phone: string, imagePath: string) {
        try {
            const jid = `${phone}@s.whatsapp.net`;
            const msg = await this.waSocket?.sendMessage(jid, {
                image: { url: imagePath }
            });
            return msg
        } catch (error) {
            handleError({ error, date: Utils.getFormattedDate(), level: "unexpected" });
        }
    }
    async sendGifMessage(phone: string, gifPath: string) {
        try {
            const jid = `${phone}@s.whatsapp.net`;
            const msg = await this.waSocket?.sendMessage(jid, {
                video: { url: gifPath },
                gifPlayback: true
            });
            return msg
        } catch (error) {
            handleError({ error, date: Utils.getFormattedDate(), level: "unexpected" });
        }
    }
    async sendStickerMessage(phone: string, stickerPath: string) {
        try {
            const jid = `${phone}@s.whatsapp.net`;
            const msg = await this.waSocket?.sendMessage(jid, {
                sticker: { url: stickerPath }
            });
            return msg
        } catch (error) {
            handleError({ error, date: Utils.getFormattedDate(), level: "unexpected" });
        }
    }
    getMessageType(message: WAMessage): "text" | "image" | "audio" | "document" | "status" | null {
        if (!message.message) return null;
        if (message.key.remoteJid === "status@broadcast") return "status"
        if (message.message.conversation || message.message.extendedTextMessage) return "text";
        if (message.message.imageMessage) return "image";
        if (message.message.audioMessage) return "audio";
        if (message.message.documentMessage) return "document";
        return null;
    }
    /**@override */
    updateMessages(message: WAMessage): void {
        if (message.key.id !== this.lasMessageID && !message.key.fromMe) {
            for (const obs of this.observers) {
                obs.onUpdateMessage(message)
            }
            this.lasMessageID = message.key.id || ""
        }
    }
}