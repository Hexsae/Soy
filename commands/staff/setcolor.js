const discord = require("discord.js");

module.exports = {
    start(data){
        let embed = new discord.MessageEmbed();

        if(data.args.length === 0){
            return data.message.channel.send("Please specify the color you would like to change your wallet to!");
        }

        let color = data.args[0];
        if(!color) return data.message.channel.send("Please select a color");
        color = color.toUpperCase();
        
        data.db.run("UPDATE userdata SET tcolor = ? WHERE discordid = ?", [color, data.message.author.id]);
        
        embed.setColor(color)
            .setDescription(`Wallet color has been changed to: **${color}**`);
        return data.message.channel.send({embed});

    }
}