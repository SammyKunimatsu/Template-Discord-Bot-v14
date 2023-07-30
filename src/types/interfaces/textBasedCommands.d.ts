import { Client, Message, PartialMessage } from "discord.js";
import i18n from "@types/i18n/index";
import config from '../../config'

interface textBasedCommand {
    name: string;
    aliases: string[];
    category: "configuration" | "economy" | "fun" | "games" | "info" | "misc" | "moderation" | "music" | "owner";
    owner?: boolean;
    cooldown?: number;
    permissions?: string[];
    async start(client: Client, message: Message | PartialMessage, args: string[], config: config, i18n: i18n, prefix: string ): void;
}

export default textBasedCommand;