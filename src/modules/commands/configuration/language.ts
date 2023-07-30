import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import slashBasedCommand from "../../../types/interfaces/slashBasedCommands";
import textBasedCommand from "../../../types/interfaces/textBasedCommands";
import baseGuild from "../../mongoDB/schemas/guild/baseGuild";

const textCommand: textBasedCommand = {
    name: "language",
    aliases: ["idioma", "locale", "local"],
    category: "configuration",
    async start(client, message, args, config, i18n, prefix) {

        const notPermEmbed = new EmbedBuilder()
        .setDescription(i18n.__("permissions.Manager_Guild"))
        .setColor("Red");
        if(!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return message.reply({ embeds: [notPermEmbed] });

        const helpEmbed = new EmbedBuilder()
        .setTitle(i18n.__("commands.language.help.title"))
        .setDescription(i18n.__mf("commands.language.help.description", { botName: client.user?.username, prefix }))
        .addFields(
            { name: i18n.__("commands.language.help.fields.title1"), value: i18n.__mf("commands.language.help.fields.description1", { prefix }) },
            { name: i18n.__("commands.language.help.fields.title2"), value: i18n.__("commands.language.help.fields.description2") }
        )
        .setColor("Blue")
        .setTimestamp();

        if(!args[0]) return message.reply({ embeds: [helpEmbed] });
        
        const language = ["pt-br", "en-us", "es"];
        const notLanguageEmbed = new EmbedBuilder()
        .setDescription(i18n.__("commands.language.notLanguage"))
        .setColor("Red");
        if(!language.includes(args[0].toLowerCase())) return message.reply({ embeds: [notLanguageEmbed] });

        try{
            await baseGuild.findOneAndUpdate({ guildId: message.guild.id }, { language: args[0].replace("en-us", "en").toLowerCase() })
            i18n.setLocale(args[0].replace("en-us", "en").toLowerCase());
            const successEmbed = new EmbedBuilder()
            .setDescription(i18n.__mf("commands.language.success", { language: args[0].toLowerCase() }))
            .setColor("Green");
            message.reply({ embeds: [successEmbed] })
        }catch(err){
            const errorEmbed = new EmbedBuilder()
            .setDescription(i18n.__("commands.language.error"))
            .setColor("Green");
            message.reply({ embeds: [errorEmbed] })
        }
    }
};

const slashCommand: slashBasedCommand = {
    name: "language",
    category: "configuration",
    data: new SlashCommandBuilder()
    .setName("language")
    .setDescription("Setar o idioma de seu servidor!")
    .addStringOption(option => option.setName("locale").setDescription("Setar local do idioma.").addChoices(
        { name: "pt-br", value: "pt-br"},
        { name: "en-us", value: "en" },
        { name: "es", value: "es"}
    ).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async start(client, interaction, config, i18n) {

        const locale = interaction.options.getString("locale");

        try{
            await baseGuild.findOneAndUpdate({ guildId: interaction.guild.id }, { language: locale })
            i18n.setLocale(locale);
            const successEmbed = new EmbedBuilder()
            .setDescription(i18n.__mf("commands.language.success", { language: locale }))
            .setColor("Green");
            interaction.reply({ embeds: [successEmbed] })
        }catch(err){
            console.error(err)
            const errorEmbed = new EmbedBuilder()
            .setDescription(i18n.__("commands.language.error"))
            .setColor("Green");
            interaction.reply({ embeds: [errorEmbed] })
        }
        
    },
}

export {textCommand, slashCommand};