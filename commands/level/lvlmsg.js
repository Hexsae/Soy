/*const discord = require("discord.js");
const fs = require("fs");
const path = require('path');
const pathToLevelMessages = path.join(__dirname, "../../database/expmessages");
const tools = require(path.join(__dirname, "../../tools/functions.js"));

module.exports = {
    start(data){
        let embed = new discord.MessageEmbed
        if(!tools.isAllowed(data.message, "ADMINISTRATOR")){
            embed.setColor("RED")
                .setDescription("You must be server administrator to set the level up message.");
            return data.message.channel.send({embed});
        }

        if(data.args.length === 0){
            fs.readFile(`${pathToLevelMessages}/${data.message.guild.id}.txt`, (err, output) => {
                if(err){
                    embed.setDescription("There is no level up message set for this server. You can set one by typing your message after %lvlmsg. Type `%help lvlmsg` for more info.")
                        .setColor("ORANGE");
                    return data.message.channel.send({embed});
                }

                else{
                    embed.setTitle("Current level up message")
                        .setDescription(output)
                        .setColor(0xFFFFF);
                    return data.message.channel.send({embed});
                }
            })
        }
        else{
            let message = data.args.join(' ');

            fs.writeFile(`${pathToLevelMessages}/${data.message.guild.id}.txt`, message, err => {
                if(err) console.warn(err);

                embed.setColor("PURPLE")
                    .setDescription("Successfully changed the level up message.");
                return data.message.channel.send({embed});
            })
        }
    }
}
*/