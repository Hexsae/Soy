const discord = require("discord.js");
const info = require('../../database/info.json').regularCommands;

module.exports = {
    start(data) {
        let embed = new discord.MessageEmbed(), description;

        description = [
            "%avatar : Displays yours or another user's avatar",
            "%choose option1,option2... : Randomly selects from listed choices separated by a comma!",
            "%link : Want me in your server?",
            "%staff : Soy bot staff member card!",
            "%serverinfo : Info on the server!",
            "%userinfo @user : Info on your user. %userinfo @user for another user.",
            "%pickup @user : Trying to score one on someone? I got you covered ;)."
        ];
        description.forEach(item => {
            let name, desc;
            name = item.split(' : ')[0];
            desc = item.split(' : ')[1];
            embed.addField(name, desc);
        });

        embed.setColor(0x32363B)
            .setAuthor("Miscellaneous commands", icon = data.soy.user.avatarURL)
            .setDescription("Type %help [command_name] for more info on the command with examples!");

        return data.message.channel.send({embed});
    }
};