import { SlashCommandBuilder } from "discord.js";
import slashBasedCommand from "../../../types/interfaces/slashBasedCommands";
import textBasedCommand from "../../../types/interfaces/textBasedCommands";
import { REST, Routes } from "discord.js";
import { slashCommands, slashCommandsMap } from "../../..";
import { guildId } from "../../../config";

const textCommand: textBasedCommand = {
    name: "registrarslash",
    aliases: [],
    category: "owner",
    owner: true,
    async start(client, message, args, config, i18n, prefix) {

        const msg = await message.reply("Registrando todos comandos slash...")
        const dataSlash = [];
        const dataOwnerSlash = [];
        try{
            slashCommandsMap.forEach(s => s.owner ? dataOwnerSlash.push(s.data) : dataSlash.push(s.data));
            const rest = new REST({ version: "10" }).setToken(process.env.TERRA_TOKEN);
            await rest.put(Routes.applicationCommands(client.user!.id), { body: dataSlash });
            await rest.put(Routes.applicationGuildCommands(client.user!.id, guildId), { body: dataOwnerSlash });
            try{
                await msg.edit("Todos comandos foram registrados com sucesso")
            }catch(err){
                message.channel.send("Todos comandos foram registrados com sucesso")
            }
        }catch(err){
            console.error(err)
            try{
                await msg.edit("Erro ao registrar os comandos, checar o console!")
            }catch(err){
                message.channel.send("Erro ao registrar os comandos, checar o console!")
            }
        }

    }
};

const slashCommand: slashBasedCommand = {
    name: "registrarslash",
    category: "info",
    owner: true,
    data: new SlashCommandBuilder().setName("registrarslash").setDescription("Registrar SlashCommands"),
    async start(client, interaction, config, i18n) {

        await interaction.reply({ content: "Registrando todos comandos slash...", ephemeral: true })
        const dataSlash = [];
        const dataOwnerSlash = [];
        try{
            slashCommandsMap.forEach(s => s.owner ? dataOwnerSlash.push(s.data) : dataSlash.push(s.data));
            const rest = new REST({ version: "10" }).setToken(process.env.TERRA_TOKEN);
            await rest.put(Routes.applicationCommands(client.user!.id), { body: dataSlash });
            await rest.put(Routes.applicationGuildCommands(client.user!.id, guildId), { body: dataOwnerSlash });
            try{
                await interaction.editReply("Todos comandos foram registrados com sucesso")
            }catch(err){
                interaction.channel.send("Todos comandos foram registrados com sucesso")
            }
        }catch(err){
            console.error(err)
            try{
                await interaction.editReply("Erro ao registrar os comandos, checar o console!")
            }catch(err){
                interaction.channel.send("Erro ao registrar os comandos, checar o console!")
            }
        }
        
    },
}

export {textCommand, slashCommand};