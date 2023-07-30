import { EmbedBuilder, GuildMember, Interaction } from "discord.js";
import baseEvents from "../../../types/interfaces/baseEvents";
import config, { i18n, language, owners } from "../../../config";
import { slashCommandsMap } from "../../..";
import slashBasedCommand from "../../../types/interfaces/slashBasedCommands";
import baseGuild from "../../mongoDB/schemas/guild/baseGuild";

export const event: baseEvents = {
    name: "interactionCreate",
    async start(client){
        client.on("interactionCreate", async(interaction: Interaction): Promise<any> => {
            if (!interaction.isChatInputCommand()) return;

            let command: slashBasedCommand = slashCommandsMap.get(interaction.commandName);

            const testDB = await baseGuild.findOne({ guildId: interaction.guild.id });
            if(!testDB) await new baseGuild({ guildId: interaction.guild.id, guildName: interaction.guild.name }).save();
            const guildDB = await baseGuild.findOne({ guildId: interaction.guild.id });

            i18n.setLocale(guildDB?.language ? guildDB.language : language);
            
            try {
            if (!command) { 
            return await interaction.reply({
                content: i18n.__("events.interaction.error"),
                ephemeral: true,
            });
            return;
            }
            if(command.owner){
            if(!owners.includes((interaction.member as GuildMember).id)){
                const embed = new EmbedBuilder()
                .setDescription(i18n.__mf("events.interaction.ownerWarn", { member: interaction.member }))
                interaction.reply({ embeds: [embed], ephemeral: true })
            }
            }
            command.start(client, interaction, config, i18n);
            } catch (err) {
            console.error(err);

            await interaction.reply({
            content: i18n.__("events.interaction.error2"),
            ephemeral: true,
            });
            }
        })
    }
}