import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import slashBasedCommand from "../../../types/interfaces/slashBasedCommands";
import textBasedCommand from "../../../types/interfaces/textBasedCommands";

const textCommand: textBasedCommand = {
    name: "ban",
    aliases: ["banir"],
    category: "moderation",
    async start(client, message, args, config, i18n, prefix) {

        const notPermEmbed = new EmbedBuilder()
        .setDescription(i18n.__("permissions.Member_Ban"))
        .setColor("Red");
        if(!message.member.permissions.has(PermissionFlagsBits.BanMembers)) return message.reply({ embeds: [notPermEmbed] });

        const helpEmbed = new EmbedBuilder()
        .setTitle(i18n.__("commands.ban.help.title"))
        .setDescription(i18n.__mf("commands.ban.help.description", {prefix}))
        .addFields(
            { name: i18n.__("commands.ban.help.fields.title1"), value: i18n.__mf("commands.ban.help.fields.description1", { prefix }) },
            { name: i18n.__("commands.ban.help.fields.title2"), value: i18n.__("commands.ban.help.fields.description2") }
        )
        .setColor("Blue")
        .setTimestamp();

        if(!args[0]) return message.reply({ embeds: [helpEmbed] });

        const member = message.guild.members.cache.get(args[0].replace(/<@/gi, "").replace(/>/gi, ""));

        const notMemberEmbed = new EmbedBuilder()
        .setDescription(i18n.__("commands.ban.notMember"))
        .setColor("Red");

        if(!member) return message.reply({ embeds: [notMemberEmbed] });

        const notYourSelfEmbed = new EmbedBuilder()
        .setDescription(i18n.__("commands.ban.notYourSelf"))
        .setColor("Yellow");

        if(member.id === message.member.id) return message.reply({ embeds: [notYourSelfEmbed] });

        const notAdminEmbed = new EmbedBuilder()
        .setDescription(i18n.__("commands.ban.notAdmin"))
        .setColor("Yellow");

        if(!member.bannable) return message.reply({ embeds: [notAdminEmbed] });
        
        let reason = args.slice(1).join(" ");
        if (!reason) reason = i18n.__("commands.ban.noReason");

        try{
            await member.ban({ deleteMessageSeconds: 604800, reason })
            const successEmbed = new EmbedBuilder()
            .setDescription(i18n.__mf("commands.ban.success", { member, memberName: member.user.username, memberId: member.id }))
            .setColor("Green");
            message.reply({ embeds: [successEmbed] })
        }catch(err){
            console.error(err)
            const errorEmbed = new EmbedBuilder()
            .setDescription(i18n.__("commands.ban.error"))
            .setColor("Green");
            message.reply({ embeds: [errorEmbed] })
        }
    }
};

const slashCommand: slashBasedCommand = {
    name: "ban",
    category: "moderation",
    data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Banir membro do servidor.")
    .addUserOption(option => option.setName("member").setDescription("Mencione o membro").setRequired(true))
    .addStringOption(option => option.setName("reason").setDescription("Coloque a razão para o membro ser banido")),
    async start(client, interaction, config, i18n) {

        const user = interaction.options.getUser("member");
        const member = interaction.guild.members.cache.get(user.id);

        const notMemberEmbed = new EmbedBuilder()
        .setDescription(i18n.__("commands.ban.notMember"))
        .setColor("Red");

        if(!member) return interaction.reply({ embeds: [notMemberEmbed] });

        const notYourSelfEmbed = new EmbedBuilder()
        .setDescription(i18n.__("commands.ban.notYourSelf"))
        .setColor("Yellow");

        if(member.id === interaction.member.user.id) return interaction.reply({ embeds: [notYourSelfEmbed] });

        const notAdminEmbed = new EmbedBuilder()
        .setDescription(i18n.__("commands.ban.notAdmin"))
        .setColor("Yellow");

        if(!member.bannable) return interaction.reply({ embeds: [notAdminEmbed] });
        
        let reason = interaction.options.getString("reason");
        if (!reason) reason = i18n.__("commands.ban.noReason");

        try{
            await member.ban({ deleteMessageSeconds: 604800, reason })
            const successEmbed = new EmbedBuilder()
            .setDescription(i18n.__mf("commands.ban.success", { member, memberName: member.user.username, memberId: member.user.id }))
            .setColor("Green");
            interaction.reply({ embeds: [successEmbed] })
        }catch(err){
            console.error(err)
            const errorEmbed = new EmbedBuilder()
            .setDescription(i18n.__("commands.ban.error"))
            .setColor("Green");
            interaction.reply({ embeds: [errorEmbed] })
        }
        
    },
}

export {textCommand, slashCommand};