const discord = require("discord.js");
const info = require('../../database/info.json').regularCommands;

module.exports ={
    start(data) {
        let embed = new discord.MessageEmbed(), cmds, description;

        description = [
            "%mod : Displays commands for server management.",
            "%misc : Displays random fun commands!",
            "%games : Displays game commands.",
            "%beans : Displays your bean wallet.",
            "%give <@user> <amount> : Gives some of your beans to a user.",
            "%leaderboard : Displays top 10 richest users in the server.",
            "%global : Displays top 10 richest users globally.",
            "%badges : Displays all your badges.",
            "%badge <name> : Displays info on a particular badge.",
            "%title <name> : Sets your title.",
            "%daily : Receive your daily spin to win beans!",
            "%shop : Opens the bean shop!",
            "%buy <item> : Purchases an item from the bean shop!"
        ];

        description.forEach(item => {
            let name, desc;
            name = item.split(' : ')[0];
            desc = item.split(' : ')[1];
            embed.addField(name, desc);
        });

        embed.setColor(0x32363B)
            .setAuthor("Commands", url = data.soy.user.avatarURL)
            .setDescription("Type %help [command_name] for more info on the command with examples!");

        return data.message.channel.send({embed});

    }
};