import "dotenv/config";
import slashBasedCommand from './types/interfaces/slashBasedCommands';
import textBasedCommand from './types/interfaces/textBasedCommands';
import { Collection, Client, ApplicationCommandDataResolvable } from 'discord.js';
import { intents, language, partials, i18n } from './config';
import moduleController from './modules';

const client: Client = new Client({intents, partials});

client.login(process.env.BOT_TOKEN);

const textCommandsMap = {
    name: new Collection<string, textBasedCommand>(),
    aliases: new Collection<string, textBasedCommand>()
}
const slashCommandsMap = new Collection<string, slashBasedCommand>();
const slashCommands = new Array<ApplicationCommandDataResolvable>();

client.on("ready", async() => {
    i18n.setLocale(language);
    console.log(i18n.__mf("moduleController.startBot", { botName: client.user?.username }));
    await moduleController(client);
    console.log(i18n.__mf("moduleController.successBot", { botName: client.user?.username }))
});

export { client, textCommandsMap, slashCommandsMap, slashCommands };

process.on('unhandledRejection', (err: any) => {
    Error.captureStackTrace(err, null);
    console.error(`unhandledRejection:\n${err.stack}`)
});

process.on("uncaughtException", (err: any) => {
    Error.captureStackTrace(err, null);
    console.error(`uncaughtException:\n${err.stack}`)
})
process.on('beforeExit', (code) => {
    console.log('ignore that log: beforeExit');
    console.log(`ignore that log: beforeExit\n\n${code}`)
});
process.on('exit', (code) => {
    console.log('ignore that log: exit');
    console.log(`ignore that log: exit\n\n${code}`)
});
process.on('warning', (warn: any) => {
    console.warn(`Warning:\n[${warn.name}] - ${warn.message}\n${warn.stack}`)
})