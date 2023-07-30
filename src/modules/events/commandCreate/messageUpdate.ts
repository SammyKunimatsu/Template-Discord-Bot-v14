import { EmbedBuilder } from "discord.js";
import { textCommandsMap } from "../../..";
import config, { prefix, i18n, owners } from "../../../config/";
import baseEvents from "../../../types/interfaces/baseEvents";
import textBasedCommand from "../../../types/interfaces/textBasedCommands";
import baseGuild from "../../mongoDB/schemas/guild/baseGuild";

export const event: baseEvents = {
    name: "messageUpdate",
    async start(client){
        client.on("messageUpdate", async(oldMessage, message) => {

            if(message.author.bot || !message.guild) return;

            const testDB = await baseGuild.findOne({ guildId: message.guild.id });
            if(!testDB) await new baseGuild({ guildId: message.guild.id, guildName: message.guild.name }).save();
            const guildDB = await baseGuild.findOne({ guildId: message.guild.id });

            i18n.setLocale(guildDB?.language ? guildDB.language : "pt-br");
            const guildPrefix = guildDB?.prefix ? guildDB.prefix : prefix;

            if(!message.content.toLowerCase().startsWith((guildPrefix).toLowerCase())) return;

            const [cmd, ...args] = message.content
            .slice(guildPrefix.length)
            .trim()
            .split(/ +/g);

            if(!cmd) return;

            const command: textBasedCommand = textCommandsMap.name.get(cmd.toLowerCase()) || textCommandsMap.aliases.get(cmd.toLowerCase());
            if(!command) return;

            if(command.owner){
                if(!owners.includes(message.member.id)){
                    const embed = new EmbedBuilder()
                    .setDescription(i18n.__mf("events.interaction.ownerWarn", { member: message.member }))
                    message.reply({ embeds: [embed] });
                    return;
                }
            }

            command.start(client, message, args, config, i18n, guildPrefix);
        })
    }
}