import {GoogleGenAI} from '@google/genai'
export class Gemini{
    private static instance: Gemini;
    private model = "gemma-3-27b-it";
    private API = "AIzaSyBaI9X74IQIQ7j6yzV1zsQp_rjlbQ9VfRQ";
    private ai: GoogleGenAI;
    private constructor(){
        this.ai = new GoogleGenAI({apiKey: this.API});
    }
    static getInstance(): Gemini{
        if (!this.instance) {
            this.instance = new Gemini();
        }
        return this.instance
    }
    public async getResponse(message: string){
        const res = await this.ai.models.generateContent({
            model: this.model,
            contents: message,
        });
        return res.text;
    }
}