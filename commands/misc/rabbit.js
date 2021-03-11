const discord = require("discord.js");

module.exports = {
    start(data){
        let embed = new discord.MessageEmbed()
            .setDescription("[Rabb.it link](https://rabb.it/soy.)")
            .setColor("PURPLE");
        return data.message.channel.send({embed});
    }
}