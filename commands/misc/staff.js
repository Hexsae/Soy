const discord = require('discord.js');
const staffList = require("../../database/info.json");

module.exports = {
    async start(data) {
        let embed = new discord.MessageEmbed(), user, accessLevel;

        if (data.args.length === 0) user = data.message.author;
        else user = await data.soy.users.fetch(data.args[0].replace(/[<@!>]/g, ''));

        if(user === undefined) return data.message.channel.send("Invalid user.");

        if (staffList.staffMembers[user.id] === 2){
            accessLevel = "Admin";
        } else if (staffList.staffMembers[user.id] === 1){
            accessLevel = "Support";
        }
        else{
            embed.setDescription(`User is not a soy bot staff member.`)
                .setColor("RED");
            return data.message.channel.send({embed})
        }
        embed.setAuthor(name = user.username, icon = user.avatarURL())
            .setTitle("Soy Bot Staff")
            .setDescription(`**Access Level:** ${accessLevel}`)
            .setColor("PURPLE");
        return data.message.channel.send({embed});
    }
};