const discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const pathToWelcomeServers = path.join(__dirname, "../../database/leaveservers");
const tools = require(path.join(__dirname, "../../tools/functions.js"));

module.exports = {
    start(data){
        let embed = new discord.MessageEmbed();

        if(!tools.isAllowed(data.message, "MANAGE_GUILD")){
            embed.setColor("RED")
                .setDescription("You must have `Manage Server` permission to set the channel for the leave message.");
            return data.message.channel.send({embed});
        }

        try{
            let fd = fs.openSync(pathToWelcomeServers + `/${data.message.guild.id}.json`, 'r');
            fs.close(fd, err =>{});
        }catch(err){
            return data.message.channel.send("You must have a leave message set first before changing the channel. Use `%setwel <message>`.");
        }

        let file = JSON.parse(fs.readFileSync(pathToWelcomeServers + `/${data.message.guild.id}.json`));

        file.channel = data.message.channel.id;

        fs.writeFileSync(pathToWelcomeServers + `/${data.message.guild.id}.json`, JSON.stringify(file));

        embed.setColor("PURPLE")
            .setDescription(`Leave message channel has successfully been changed to **${data.message.channel.name}**.`);
        return data.message.channel.send({embed});
    }
}