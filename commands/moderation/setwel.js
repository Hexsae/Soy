const discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const pathToWelcomeServers = path.join(__dirname, "../../database/welcomeservers");
const tools = require(path.join(__dirname, "../../tools/functions.js"));

module.exports = {
    start(data){
        let embed = new discord.MessageEmbed()

        if(!tools.isAllowed(data.message, "MANAGE_GUILD")){
            embed.setColor("RED")
                .setDescription("You must have `Manage Server` permission to set the welcome message.")
            return data.message.channel.send({embed});
        }

        let welcomeMessage = data.args.join(" ");
        let format = JSON.stringify({
            message: welcomeMessage,
            channel: data.message.channel.id
        });

        fs.writeFile(pathToWelcomeServers + `/${data.message.guild.id}.json`, format, (err) => {
            if(err) console.warn(err);
            else{
                embed.setColor("PURPLE")
                    .setTitle("📥 Welcome message set to:")
                    .setDescription(welcomeMessage);
                
                data.message.channel.send({embed});
            }
        });
    }
}