const discord = require("discord.js");

module.exports = {
    async start(data){
        if(data.args.length === 0){
            return data.message.channel.send("Please specify the name of the game.");
        }
        try{
            await data.soy.user.setPresence({ activity: { name: data.args.join(" "), type: 0 } });
        }catch(err) {console.log(err)}

        let embed = new discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("Changed game status to:")
            .setDescription(data.args.join(" "));
        return data.message.channel.send({embed});
    }
}