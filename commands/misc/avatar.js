const discord = require('discord.js');

module.exports = {
    async start(data){
        let user;
        if (data.args.length === 0) user = data.message.author;
        else user = await data.soy.users.fetch(data.args[0].replace(/[<@!>]/g, ''));

        embed = new discord.MessageEmbed()
            .setColor(0xFFFF)
            .setTitle(`__${user.username}'s Avatar__`)
            .setImage(user.avatarURL());
        return data.message.channel.send({embed});
    }
};