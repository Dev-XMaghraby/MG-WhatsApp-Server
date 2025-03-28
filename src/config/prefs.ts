import { resolve } from "path";
import { Utils } from "../utils/utils";
import { DataBase } from "../utils/database";

export const initial_prefs = {
    init: true,
    version: "0.0.1",
    user_name: "",
    settings: {
        auto_status: false,
        reconnect_delay: 5
    }
}

export type PREFS_TYPE = Partial<typeof initial_prefs>;
export type PREFS_SETTINGS = Partial<typeof initial_prefs.settings>

export class Prefs{
    private db = new DataBase("prefs.json")
    private static instance: Prefs;
    private constructor(){
        this.init();
    }
    static getInstance(): Prefs{
        if (!this.instance) {
            this.instance = new Prefs();
        }
        return this.instance
    }
    private init(){
        const isInitialized = this.db.getKey("init")
        if (!isInitialized) {
            Utils.writeFile(resolve(Utils.STATIC_PATH, "prefs.json"), JSON.stringify(initial_prefs))
        }
    }
    public putPref(key: keyof PREFS_TYPE, data: PREFS_TYPE[typeof key]){
        this.db.putKey(key, data);
    }
    public putSetting(key: keyof PREFS_SETTINGS, data: PREFS_SETTINGS[typeof key]){
        const settings = this.db.getKey("settings") || {};
        settings[key] = data;
        this.db.putKey("settings", settings);
    }
    public getPref(key: string){
        return this.db.getKey(key)
    }
}