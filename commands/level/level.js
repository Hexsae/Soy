/*const discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const levelUsers = path.join(__dirname, "../../database/expservers");
const levels = require(path.join(__dirname, "../../database/levels.json"));

module.exports = {
    start(data){
        let embed = new discord.MessageEmbed();
        let level, currentExp, expToNextLevel, user;

        if(data.args.length === 0) user = data.message.guild.member(data.message.author);
        else{
            user = data.message.guild.member(data.args[0].replace(/[<@!>]/g, ''));
            if(!user) user = data.message.guild.member(data.message.author);
        }

        if(user.user.bot && !user.user === data.soy.user) return;
        if(user.user === data.soy.user){
            embed.setColor(0xFFFFF)
                .setAuthor(user.user.tag, user.user.avatarURL)
                .addField("Level", 999, true)
                .addField("Exp", "0/0", true);
            return data.message.channel.send({embed});
        }

        fs.readFile(`${levelUsers}/${data.message.guild.id}/${user.id}.json`, (err, output) => {
            if(err){
                level = 0;
                currentExp = 0;
                expToNextLevel = 60;
            }
            else{
                output = output.toString()
                output = JSON.parse(output);

                level = output.level;
                currentExp = output.exp;
                expToNextLevel = levels[output.level + 1];
            }

            embed.setColor(0XFFFFF)
                .setAuthor(user.user.tag, user.user.avatarURL)
                .addField("Level", level, true)
                .addField("Exp", `${currentExp}/${expToNextLevel}`, true);
            return data.message.channel.send({embed});
        })
    }
}
*/