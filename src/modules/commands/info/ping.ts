import { SlashCommandBuilder } from "discord.js";
import slashBasedCommand from "../../../types/interfaces/slashBasedCommands";
import textBasedCommand from "../../../types/interfaces/textBasedCommands";

const textCommand: textBasedCommand = {
    name: "ping",
    aliases: ["teste"],
    category: "info",
    start(client, message, args, config, i18n, prefix) {

        message.reply("pong!")
        
    }
};

const slashCommand: slashBasedCommand = {
    name: "ping",
    category: "info",
    data: new SlashCommandBuilder().setName("ping").setDescription("ping pong"),
    async start(client, interaction, config, i18n) {

        await interaction.reply("pong!")
        
    },
}

export {textCommand, slashCommand};