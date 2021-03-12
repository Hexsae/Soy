const discord = require("discord.js");

module.exports = {
    start(data){
        data.db.all("SELECT * FROM userdata ORDER BY beans DESC", (err, rows) => {

            let embed = new discord.MessageEmbed()
                .setColor(0xFFFFF)
                .setTitle("📈 Global Bean Leaderboard");

            for(let i =0; i < rows.length; i++){
                embed.addField(`${i + 1}) ${rows[i].name.slice(0, rows[i].name.length - 5).slice(0, 16)}`, `${rows[i].beans}`, true);
            }

            return data.message.channel.send({embed});
        })
    }
}


