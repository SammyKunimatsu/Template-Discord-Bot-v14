import { SlashCommandBuilder } from "discord.js";
import slashBasedCommand from "../../../types/interfaces/slashBasedCommands";
import textBasedCommand from "../../../types/interfaces/textBasedCommands";

const textCommand: textBasedCommand = {
    name: "eval",
    aliases: ["evaluate"],
    category: "owner",
    owner: true,
    start(client, message, args, config, i18n, prefix) {

        try{
            const console = args[0];
            if (!console) return message.reply(`Você precisa colocar true/false se quer mostrar o console no primeiro argumento.`);
            if ((console !== "true") && (console !== "false")) return message.reply(`Você precisa colocar true/false se quer mostrar o console no primeiro argumento.`);
            const code = args.slice(1).join(" ");
            let evaled = eval(`${code}`);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);
            if (console === "true") {
                message.channel.send((`\`\`\`js\nconsole:\n ${evaled}\n\`\`\``));
            }
        } catch (err) {
            message.channel.send(`\`\`\`xl\n${err}\n\`\`\``);
        }
        
    }
};

const slashCommand: slashBasedCommand = {
    name: "eval",
    category: "info",
    owner: true,
    data: new SlashCommandBuilder().setName("eval").setDescription("Execute códigos").addStringOption((option) => option.setName('evaluate').setDescription('Entre com o código').setRequired(true)),
    async start(client, interaction, config, i18n) {

        try {

            const string = interaction.options.getString('evaluate');
            let evaled = eval(string)  
    
            if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);
    
            await interaction.reply(`\`\`\`js\nconsole:\n ${evaled}\n\`\`\``);
            
          } catch (err) {
            console.log(err);

            await interaction.reply({ content: err.message, ephemeral: true });
          }
        
    },
}

export {textCommand, slashCommand};