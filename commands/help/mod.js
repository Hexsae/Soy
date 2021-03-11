const discord = require("discord.js");
const info = require('../../database/info.json').regularCommands;

module.exports = {
    start(data) {
        let embed = new discord.MessageEmbed(), description;

        description = [
            "%purge : Deletes the last x number of messages from the chat! I need to have permissions to `Manage Messages`.",
            "%setwel : Sets the welcome message you want mee to say when a user joins the server!",
            "%setleave : Sets  the leave message you want me to say when someone leaves the server!",
            "%delwel : Deletes the welcome message for that server!",
            "%delleave : Deletes the leave message for that server!",
            "%welmsg : Displays the server's current welcome message.",
            "%leavemsg : Displays the server's current leave message.",
            "%wel : Sets the welcome channel to the current channel.",
            "%leave : Sets the leave channel to the current channel.",
            "%exp on/off : Turns leveling for that channel on/off.",
        ];
        
        description.forEach(item => {
            let name, desc;
            name = item.split(' : ')[0];
            desc = item.split(' : ')[1];
            embed.addField(name, desc);
        });

        embed.setColor(0x32363B)
            .setAuthor("Moderation commands", icon = data.soy.user.avatarURL)
            .setDescription("Type %help [command_name] for more info on the command with examples!");

        return data.message.channel.send({embed});
    }
};