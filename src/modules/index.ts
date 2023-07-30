import { Client } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { slashCommands, slashCommandsMap, textCommandsMap } from "..";
import connectMongoDB from "./mongoDB";
import { i18n } from "../config";

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function setLogLoading(log: string){
    const loading = ["🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘"];
    let i = 0;
    clearInterval(global.interval)
    global.interval = setInterval(() => {
        process.stdout.write(`\r${loading[i++ % loading.length]} ${log}`)
    }, 200)
}

function setLogLoadedFinal(emoji: string, log: string){
    clearInterval(global.interval)
    process.stdout.write(`\r${emoji} ${log}\n`)
}

const moduleController = async(client: Client) => {
    console.log(i18n.__("moduleController.loadingModules"))
    try{
        setLogLoading(i18n.__("moduleController.startMongo"));
        await connectMongoDB();
        setLogLoadedFinal("✅", i18n.__("moduleController.successMongo"))
    }catch(err){
        setLogLoadedFinal("❌", i18n.__("moduleController.errorMongo"))
    }
    await delay(1000)
    try{
        console.log(i18n.__("moduleController.loadingEvents"))
        const dirs = readdirSync(join(__dirname, ".", "events"));
        for (const dir of dirs) {
            const eventFiles = readdirSync(`${join(__dirname, ".", "events")}/${dir}`).filter((file) => file.endsWith(".ts"));
            if(eventFiles.length > 0) console.log(`- ${dir}:`)
            for (const file of eventFiles) {
                const baseEvent = await import(join(__dirname, ".", "events", `${dir}`,`${file}`));
                await delay(200);
                try{
                    await baseEvent.event.start(client);
                    console.log(`✅ ${baseEvent.event.name}`)
                }catch(err){
                    console.log(`❌ ${baseEvent.event.name}`)
                }
            }
        }
    }catch(err){
        console.error(i18n.__("moduleController.errorEvents"), err)
    }
    await delay(1000)
    try{
    console.log(i18n.__("moduleController.loadingCommands"))
    const dirs = readdirSync(join(__dirname, ".", "commands"));
    for (const dir of dirs) {
        const commandFiles = readdirSync(`${join(__dirname, ".", "commands")}/${dir}`).filter((file) => file.endsWith(".ts"));

        for (const file of commandFiles) {
            const command = await import(join(__dirname, ".", "commands", `${dir}`,`${file}`));
            const checkCommand = [];
            await delay(200);
            try{
                textCommandsMap.name.set(command.textCommand.name, command.textCommand);
                if(command.textCommand.aliases[0]) command.textCommand.aliases.forEach((element: string) => textCommandsMap.aliases.set(element, command.textCommand));
                checkCommand.push(true)
            }catch(err: any){
                checkCommand.push(false)
            }

            try{
                slashCommandsMap.set(command.slashCommand.name, command.slashCommand)
                slashCommands.push(command.slashCommand.data)
                checkCommand.push(true)
            }catch(err: any){
                checkCommand.push(false)
            }

            console.log(i18n.__mf("moduleController.resultCommand", {name: file, textStatus: `${checkCommand[0] ? '✅' : '❌'}`, slashStatus: `${checkCommand[1] ? '✅' : '❌'}`}))
        }
    }
    console.log(i18n.__("moduleController.successCommands"))
    }catch(err){
        console.error(i18n.__("moduleController.errorCommands"), err)
    }
    await delay(1000)
    console.log(i18n.__("moduleController.successModules"))
}

export default moduleController;