const discord = require("discord.js");
<<<<<<< HEAD
let owners = ["242346349859700736", "197478173015932928"];
=======
>>>>>>> 81ee908 (Fixes)

module.exports = {
    start(data){
        data.db.all("SELECT * FROM userdata ORDER BY beans DESC", (err, rows) => {
<<<<<<< HEAD
            //Removing us from leaderboard
            rows = rows.filter(item => {
                return !owners.includes(item.discordid);
            }).slice(0, 10);
=======
>>>>>>> 81ee908 (Fixes)

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


