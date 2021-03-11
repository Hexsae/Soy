const discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const pathToWelcomeServers = path.join(__dirname, "../../database/welcomeservers");
const tools = require(path.join(__dirname, "../../tools/functions.js"));

module.exports = {
    start(data){
        let embed = new discord.MessageEmbed();

        if(!tools.isAllowed(data.message, "MANAGE_GUILD")){
            embed.setColor("RED")
                .setDescription("You must have `Manage Server` permission to view the leave message.");
            return data.message.channel.send({embed});
        }
        
        try{
            let fd = fs.openSync(`${pathToWelcomeServers}/${data.message.guild.id}.json`, 'r');
            fs.close(fd, err => {});
        }catch(err){
            embed.setDescription("There is no welcome message set for this server.")
                .setColor("ORANGE");

            return data.message.channel.send({embed});
        }

        fs.unlink(`${pathToWelcomeServers}/${data.message.guild.id}.json`, err => {
            if(err) console.warn(err);

            embed.setColor("GREEN")
                .setDescription("Successfully deleted the welcome message for this server.");

            return data.message.channel.send({embed});

        });
    }
}