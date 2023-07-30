import baseEvents from "../../../types/interfaces/baseEvents";
import baseGuild from "../../mongoDB/schemas/guild/baseGuild";

export const event: baseEvents = {
    name: "guildCreate",
    async start(client){
        client.on("guildCreate", async(guild) => {

            const testDB = await baseGuild.findOne({ guildId: guild.id });
            if(!testDB) await new baseGuild({ guildId: guild.id, guildName: guild.name }).save();

        })
    }
}