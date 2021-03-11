const discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const pathToLeaveServers = path.join(__dirname, "../../database/leaveservers");
const tools = require(path.join(__dirname, "../../tools/functions.js"));

module.exports = {
    start(data){
        let embed = new discord.MessageEmbed()

        if(!tools.isAllowed(data.message, "MANAGE_GUILD")){
            embed.setColor("RED")
            .setDescription("You must have `Manage Server` permission to set the leave message.")
        return data.message.channel.send({embed});
        }

        let leaveMessage = data.args.join(" ");
        let format = JSON.stringify({
            message: leaveMessage,
            channel: data.message.channel.id
        });

        fs.writeFile(pathToLeaveServers + `/${data.message.guild.id}.json`, format, (err) => {
            if(err) console.warn(err);
            else{
                embed.setColor("PURPLE")
                    .setTitle("📤 Leave message set to:")
                    .setDescription(leaveMessage);
                
                data.message.channel.send({embed});
            }
        });
    }
}