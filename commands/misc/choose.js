const discord = require("discord.js");
const tools = require("../../tools/functions.js");

module.exports = {
    start(data){
        let message = data.args.join(" ");
        if(!message){
            return data.message.channel.send("Please list the choices separated by a comma.")
        }
        let options = message.split(/,\s?/g) //split by comma and space after comma in case
        let choice = tools.soyChoice(options);

        let embed = new discord.MessageEmbed();
        embed.setColor("PURPLE")
            .setTitle("Options")
            .setDescription(options.join("\n"))
            .addField("Choice", `**${choice}**`);
        return data.message.channel.send({embed});
    }
}