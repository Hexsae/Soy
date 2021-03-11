const discord = require("discord.js");
const info = require('../../database/info.json').regularCommands;

module.exports = {
    start(data) {
        let embed = new discord.MessageEmbed(), description;

        description = [
            "%play <number> : Play a guessing game to win beans!",
            "%bet <amount> <choice> : Bet your beans on **h** or **s** for a 50/50 chance to win more beans!",
            "%8ball <question> : Ask me any YES or NO question! My knowledge draws from the mighty bean stalk!"
        ];
        
        description.forEach(item => {
            let name, desc;
            name = item.split(' : ')[0];
            desc = item.split(' : ')[1];
            embed.addField(name, desc);
        });

        embed.setColor(0x32363B)
            .setAuthor("Games", icon = data.soy.user.avatarURL)
            .setDescription("Type %help [command_name] for more info on the command with examples!");

        return data.message.channel.send({embed});
    }
};