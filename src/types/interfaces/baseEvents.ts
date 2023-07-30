import { Client } from "discord.js";

interface baseEvents {
    name: string;
    start(client: Client): any;
}

export default baseEvents;