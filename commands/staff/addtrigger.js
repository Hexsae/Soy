const Discord = require("discord.js");
const p = require("path")
const path = p.resolve(__dirname, "../../database/responses.json");
const responses = require(path);
const fs = require("fs");
module.exports = {
    async start(data){
        if(data.args.length === 0)
            return data.message.channel.send("Correct format: `+addtrigger new/update [trigger|words] [trigger|responses]`");

        let action, triggerWords, triggerResponses, parsedData;
        let embed = new Discord.MessageEmbed();

        action = data.args[0].toLowerCase();
        if(action != "new" && action != "update"){
            embed.setColor(0xff0000)
                .setDescription("Action can only be either `new` or `update`")
            return data.message.channel.send({embed})
        }
        parsedData = data.message.content.match(/\[(.*?)\]/g);

        triggerWords = parsedData[0].replace(/[\[\]]/g, "").split("|");
        triggerResponses = parsedData[1].replace(/[\[\]]/g, "").split("|");

        if(action === "new"){
            for (key in responses){
                let temp = key.split("|");
                if(triggerWords.some(r => temp.includes(r))){
                    embed.setColor(0xff0000)
                        .setDescription("One or more trigger words are already registered.");
                    return data.message.channel.send({embed});
                }
            }
            responses[triggerWords].

        }



    }
}