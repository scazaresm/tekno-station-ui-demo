import * as signalR from "@microsoft/signalr";

const hubUrl = "http://192.168.100.11:8083/plchub";

export class SignalRService {
    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl)
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();
        
        this.isConnected = false; 
    }

    async startConnection() {
        if (this.isConnected || this.connection.isConnected) {
            console.log("✅ Already connected to SignalR Hub");
            return;
        }

        try {
            await this.connection.start();
            this.isConnected = true;
            console.log("✅ Connected to SignalR Hub");
        } catch (err) {
            console.error("❌ Error connecting to SignalR:", err);
            setTimeout(() => this.startConnection(), 5000); 
        }
    }

    listenForTagValueChanged(callback) {
        this.connection.on("TagValueChanged", callback);
    }

    stopListening() {
        this.connection.off("TagValueChanged");
    }
}

export const signalRService = new SignalRService();
