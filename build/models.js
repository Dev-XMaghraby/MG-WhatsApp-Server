"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaSocket = exports.MessageHandler = exports.default_prefs = void 0;
exports.default_prefs = {
    name: "User",
    version: "0.0.01",
    settings: {
        auto_status: false,
    }
};
class MessageHandler {
    onUpdateMessage(message) {
        console.log(message);
    }
}
exports.MessageHandler = MessageHandler;
class WaSocket {
    constructor() {
        this.observers = [];
    }
    addObserver(obs) {
        this.observers.push(obs);
    }
    removeObserver(obs) {
        const index = this.observers.indexOf(obs);
        index != 1 && this.observers.splice(index, 1);
    }
    updateMessages(message) {
        throw new Error("Method not implemented.");
    }
}
exports.WaSocket = WaSocket;
