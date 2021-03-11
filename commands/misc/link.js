const discord = require("discord.js");

module.exports = {
    start(data){
        let embed = new discord.MessageEmbed()
            .setTitle("My invite link!")
            .setDescription("[Invite link](https://discordapp.com/oauth2/authorize?client_id=268479232731119617&scope=bot&permissions=8192)")
            .setColor("PURPLE");
        return data.message.channel.send({embed});
    }
}