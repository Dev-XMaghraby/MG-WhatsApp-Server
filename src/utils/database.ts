import { resolve } from "path";
import { Utils } from "./utils";

export class DataBase {
    private fileName: string;
    constructor(fileName: string) {
        this.fileName = resolve(Utils.STATIC_PATH, fileName);
        this.init();
    }
    private init(){
        console.log("initializing data base");
        const exists = Utils.checkFile(this.fileName).existance
        console.log(`from init data base: ${exists}`);
        
        if (!exists) {
            const res = Utils.writeFile(this.fileName, "{}");
            if (!res.state) {
                throw new Error("Can't create db file");
            }
        }
    }
    private getData(): any{
        const data = Utils.readFile(this.fileName);
        if (!data.state) {
            throw new Error("can't read the db file");
        }
        if(!data.data){
            throw new Error("no data found");
        }
        return JSON.parse(data.data);
    }
    public putKey(key: string, dat: any, options: {override?: boolean} = {override: true}){
        const data = this.getData();
        if (!options.override) {
            if ((data as Object).hasOwnProperty(key)) {
                return;
            }
        }
        data[key] = dat;
        console.log(data);
        
        Utils.writeFile(this.fileName, JSON.stringify(data))
    }
    public getKey(key: string){
        const data = this.getData();
        if (!(data as Object).hasOwnProperty(key)) {
            return undefined;
        }else{
            return data[key];
        }
    }
    public deleteKey(key: string){
        const data = this.getData();
        if ((data as Object).hasOwnProperty(key)) {
            delete data[key];
            Utils.writeFile(this.fileName, JSON.stringify(data));
        }
    }
}