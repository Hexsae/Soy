const discord = require("discord.js");

module.exports = {
    start(data){
        const embed = new discord.MessageEmbed()
            .setColor(0xFFFFF)
            .setTitle("🛒 Bean shop")
            .setDescription("Type `%buy <item>` to purchase an item from the shop!");

        data.db.all("SELECT * FROM beanshop", (err, rows) => {
            for (let i = 0; i < rows.length; i++) {
                if(rows[i].exclusive){
                    embed.addField(rows[i].name, `**${rows[i].exclusive}**`, true)
                }
                else{
                    embed.addField(rows[i].name, `${rows[i].price} 🥔`, true)
                }
            }

            return data.message.channel.send({embed});
        })
    }
}