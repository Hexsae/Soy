const fs = require("fs");
const banList = require("../../database/banlist.json");
const discord = require("discord.js");

module.exports = {
    async start(data){
        let embed = new discord.MessageEmbed()
            .setTitle("Banned users list")
            .setColor("GREEN");

        if (Object.keys(banList).length === 0) {
            embed.setDescription("---No banned users---");
        }else{
            for(user in banList) {
                embed.addField(banList[user].username, `Reason: ${banList[user].reason}\nTime: ${banList[user].time}`)
            }
        }
        return data.message.channel.send({embed});
    }
}