import { Schema, model } from "mongoose";

const baseGuild = new Schema({
    guildId: String,
    guildName: String,
    prefix: String,
    language: String
})

export default model("guilds", baseGuild)