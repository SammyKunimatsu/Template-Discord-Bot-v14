import { Client, SlashCommandBuilder, BaseInteraction, ChatInputCommandInteraction, SharedSlashCommandOptions } from "discord.js";
import i18n from "i18n";
import config from "../../config";

interface slashBasedCommand {
    name: string;
    category: "configuration" | "economy" | "fun" | "games" | "info" | "misc" | "moderation" | "music" | "owner";
    owner?: boolean;
    cooldown?: number;
    permissions?: string[];
    data: SlashCommandBuilder<SharedSlashCommandOptions>;
    async start(client: Client, interaction: ChatInputCommandInteraction, config: config, i18n: i18n): void;
}

export default slashBasedCommand;