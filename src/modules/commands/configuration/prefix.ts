import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import slashBasedCommand from "../../../types/interfaces/slashBasedCommands";
import textBasedCommand from "../../../types/interfaces/textBasedCommands";
import baseGuild from "../../mongoDB/schemas/guild/baseGuild";

const textCommand: textBasedCommand = {
    name: "prefix",
    aliases: ["prefixo", "prefijo"],
    category: "configuration",
    async start(client, message, args, config, i18n, prefix) {

        const notPermEmbed = new EmbedBuilder()
        .setDescription(i18n.__("permissions.Manager_Guild"))
        .setColor("Red");
        if(!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return message.reply({ embeds: [notPermEmbed] });

        const helpEmbed = new EmbedBuilder()
        .setTitle(i18n.__("commands.prefix.help.title"))
        .setDescription(i18n.__mf("commands.prefix.help.description", { botName: client.user?.username, prefix }))
        .addFields(
            { name: i18n.__("commands.prefix.help.fields.title1"), value: i18n.__mf("commands.prefix.help.fields.description1", { prefix }) },
            { name: i18n.__("commands.prefix.help.fields.title2"), value: i18n.__("commands.prefix.help.fields.description2") }
        )
        .setColor("Blue")
        .setTimestamp();
        if(!args[0]) return message.reply({ embeds: [helpEmbed] });

        const maxLengthEmbed = new EmbedBuilder()
        .setDescription(i18n.__("commands.prefix.maxLength"))
        .setColor("Yellow");

        if(args[0].length > 8) return message.reply({ embeds: [maxLengthEmbed] });

        try{
            await baseGuild.findOneAndUpdate({ guildId: message.guild.id }, { prefix: args[0].toLowerCase() })
            const successEmbed = new EmbedBuilder()
            .setDescription(i18n.__mf("commands.prefix.success", { prefix: args[0].toLowerCase() }))
            .setColor("Green")
            .setTimestamp();
            message.reply({ embeds: [successEmbed] });
        }catch(err){
            console.error(err)
            const errorEmbed = new EmbedBuilder()
            .setDescription(i18n.__("commands.prefix.error"))
            .setColor("Red")
            .setTimestamp();
            message.reply({ embeds: [errorEmbed] });
        }

    }
};

const slashCommand: slashBasedCommand = {
    name: "prefix",
    category: "configuration",
    data: new SlashCommandBuilder()
    .setName("prefix")
    .setDescription("Setar prefixo da bot")
    .addStringOption(option => option.setName("value").setDescription("Inserir valor do prefixo").setRequired(true)),
    async start(client, interaction, config, i18n) {

        const value = interaction.options.getString("value");

        const maxLengthEmbed = new EmbedBuilder()
        .setDescription(i18n.__("commands.prefix.maxLength"))
        .setColor("Yellow");

        if(value.length > 8) return interaction.reply({ embeds: [maxLengthEmbed] });

        try{
            await baseGuild.findOneAndUpdate({ guildId: interaction.guild.id }, { prefix: value.toLowerCase() })
            const successEmbed = new EmbedBuilder()
            .setDescription(i18n.__mf("commands.prefix.success", { prefix: value.toLowerCase() }))
            .setColor("Green")
            .setTimestamp();
            interaction.reply({ embeds: [successEmbed] });
        }catch(err){
            const errorEmbed = new EmbedBuilder()
            .setDescription(i18n.__("commands.prefix.error"))
            .setColor("Red")
            .setTimestamp();
            interaction.reply({ embeds: [errorEmbed] });
        }
        
    },
}

export {textCommand, slashCommand};