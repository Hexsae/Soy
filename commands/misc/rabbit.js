const discord = require("discord.js");

module.exports = {
    start(data){
        let embed = new discord.MessageEmbed()
            .setDescription("[")
            .setColor("PURPLE");
        return data.message.channel.send({embed});
    }
}