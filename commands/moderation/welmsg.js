const discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const pathToWelcomeServers = path.join(__dirname, "../../database/welcomeservers");
const tools = require(path.join(__dirname, "../../tools/functions.js"));

module.exports = {
    start(data){
        let embed = new discord.MessageEmbed(), file;

        if(!tools.isAllowed(data.message, "MANAGE_GUILD")){
            embed.setColor("RED")
                .setDescription("You must have `Manage Server` permission to view the welcome message.");
            return data.message.channel.send({embed});
        }

        try{
            let fd = fs.openSync(`${pathToWelcomeServers}/${data.message.guild.id}.json`, 'r');
            fs.close(fd, err=>{});
            file = JSON.parse(fs.readFileSync(`${pathToWelcomeServers}/${data.message.guild.id}.json`));
        }catch(err){
            embed.setColor("ORANGE")
                .setDescription("There is no welcome message set for this server.");
            return data.message.channel.send({embed});
        }

        let channel = data.message.guild.channels.cache.array().filter(ch => {return ch.id === file.channel});

        if(!channel) return;

        embed.setColor(0xFFFFF)
            .setTitle("Current welcome message")
            .setDescription(file.message)
            .addField("Channel", channel[0].name);
        return data.message.channel.send({embed});

    }
}