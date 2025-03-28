import { existsSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { resolve } from "path";

type FileRes = {
    state: boolean,
    data?: string,
    existance? :boolean
}

export class Utils{
    static isProduction: boolean = process.argv.length == 2 && process.argv[2] !== 'test'
    static STATIC_PATH = resolve(__dirname, this.isProduction? "static/" : "../../static/");
    static checkFile(path: string): FileRes{
        const existance = existsSync(path);
        return {state: true, existance}
    }
    static writeFile(path: string, data: string): FileRes{
        writeFileSync(path, data, {encoding: "utf-8"});
        return {state: true}
    }
    static readFile(path: string): FileRes{
        const data = readFileSync(path, {encoding: "utf-8"});
        return {state: true, data}
    }
    static deleteFile(path: string): FileRes{
        unlinkSync(path);
        return {state: true}
    }
    static async delay(sec: number): Promise<void>{
        return new Promise((resolve) => {
            setTimeout(resolve, sec * 1000)
        })
    }
    static getRandomEmoji(): string {
        const emojis = ["👾", "🤡", "💢", "🦂", "🕷️", "🌟", "💕", "❣️", "💀", "⚡", "♦️", "🎉", "✨", "✔️", "💥"];
        return emojis[Math.floor(Math.random() * emojis.length)];
    }
    static getFormattedDate(): string {
        const date = new Date();
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}/${month} @ ${hours}-${minutes}`;
    }
}