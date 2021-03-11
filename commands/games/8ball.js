const discord = require("discord.js");
const path =  require("path");
const tools = require(path.join(__dirname, "../../tools/functions.js"));
const responses = require(path.join(__dirname, "../../database/8ball_responses.json"));

module.exports = {
    async start(data){
        const embed = new discord.MessageEmbed()
            .setColor("PURPLE")
            .setDescription(data.args.join(" "))
            .addField("Response :speech_balloon: ", tools.soyChoice(responses));
        return data.message.channel.send({embed});
    }
}