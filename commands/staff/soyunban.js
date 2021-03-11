const fs = require("fs");
const banList = require("../../database/banlist.json");
const discord = require("discord.js");

module.exports = {
    async start(data){
        if(data.args.length < 1){
            return data.message.channel.send("Please specify the user to unban.");
        }

        if (data.args[0] in banList) return data.message.channel.send("User not found in ban list!");

        delete banList[data.args[0]]
        
        fs.writeFile("/root/Soybot/database/banlist.json", JSON.stringify(banList), err =>{
            if(err)
                console.log("An error occured adding user to banlist: " + String(err));
        })
        
        const embed = new discord.MessageEmbed()
            .setTitle("User unbanned!")
            .attachFile("/root/Soybot/unbanned.png")
            .setThumbnail("attachment://unbanned.png")
            .addField(`User:`, user)
            .setColor("PURPLE");
        data.message.channel.send({embed});
    }
}
