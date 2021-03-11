const discord = require('discord.js');
const owners = require("../../settings.json").owners;

module.exports = {
    async start(data) {
        let embed = new discord.MessageEmbed();
        if(data.args.length < 2){
            return data.message.channel.send("Please specify the user and name of title.");
        }
        let user = data.args[0].replace(/[<!@>]/g, '');
        user = await data.soy.users.fetch(user);
        let title = data.args.slice(1).join(' ');

        if(!user) return data.message.channel.send("User was not found.");
            
        data.db.run("UPDATE userdata SET title = ? WHERE discordId = ?",[title, user.id]);
        embed = new discord.MessageEmbed()
            .setColor("PURPLE")
            .setDescription(`You have successfully set ${user}'s title to **${title}**!`);
        return data.message.channel.send({embed})
            
    }
};
