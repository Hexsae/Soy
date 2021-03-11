/*const discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const pathToLevels = path.join(__dirname, "../../database/expchannels");
const tools = require(path.join(__dirname, "../../tools/functions.js"));

module.exports = {
    start(data){
        let choice = data.args[0];
        let embed = new discord.MessageEmbed();

        if(!tools.isAllowed(data.message, "ADMINISTRATOR")){
            embed.setColor("RED")
                .setDescription("You must be server administrator to enable/disable XP in a channel.");
            return data.message.channel.send({embed});
        }

        if (!choice){
            let channelList = [];

            fs.readdir(pathToLevels, (err, files) => {
                if(err) console.log(err);

                files = files.filter(f => {return data.message.guild.channels.array().map(chan => {return chan.id}).includes(f)});

                for (let i = 0; i < files.length; i++){
                    let channelObject = data.message.guild.channels.get(files[i])
                    
                    if(!channelObject) continue;
                    else channelList.push(channelObject.name);
                }

                embed.setColor(0xFFFFF)
                    .setTitle("Channels with levelling turned on.")
                    .setDescription(channelList.join("\n"));

                return data.message.channel.send({embed});
            })
        }

        else{
            if(choice !== "on" && choice !== "off"){
                return data.message.channel.send("Invalid choice. Type `%help exp` for more info.");
            }
            else if (choice === "on"){
                fs.readdir(pathToLevels, (err, files) => {
                    if(!files.includes(data.message.channel.id)){
                        fs.writeFileSync(pathToLevels + "/" + data.message.channel.id);

                        embed.setColor("PURPLE")
                            .setDescription("Levelling has been **enabled** in this channel. XP can now be gotten from messages within this channel.");
                        return data.message.channel.send({embed});
                    }
                    embed.setColor("ORANGE")
                        .setDescription("Levelling is already enabled for this channel.");
                    return data.message.channel.send({embed});
                })
            }
            else{
                fs.readdir(pathToLevels, (err, files) => {
                    if(files.includes(data.message.channel.id)){
                        fs.unlinkSync(pathToLevels + "/" + data.message.channel.id);

                        embed.setColor("PURPLE")
                            .setDescription("Levelling has been **disabled** in this channel.");
                        return data.message.channel.send({embed});
                    }
                    embed.setColor("ORANGE")
                        .setDescription("Levelling is already disabled for this channel.");
                    return data.message.channel.send({embed});
                })
            }
        }
    }
}
*/