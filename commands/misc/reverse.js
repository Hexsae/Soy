const discord = require("discord.js");

module.exports = {
    start(data){
        let message = data.args.join(" ");
        let reversedMessage = "";

        for(let i = message.length - 1; i >= 0; i--){
            reversedMessage += message[i];
        }

        let embed = new discord.MessageEmbed()
            .setDescription(reversedMessage)
            .setColor(0xFFFFFF);
        data.message.channel.send({embed});
    }
}