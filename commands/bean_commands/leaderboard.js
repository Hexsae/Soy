const discord = require("discord.js");
let owners = ["242346349859700736", "197478173015932928"];

module.exports = {
       async start(data){
        let embed = new discord.MessageEmbed()
        .setTitle("📉 Server Bean Leaderboard")
            .setColor(0xFFFFF);
        
        let serverMembers = await data.message.guild.members.fetch()
        serverMembers = serverMembers.array().map(member => {
            return `${member.id}`;
        });

        let query = `SELECT * FROM userdata WHERE discordid in (${serverMembers}) ORDER BY beans DESC`

        data.db.all(query, (err, rows) => {
            //Removing us from leaderboard
            if(err){
                return console.log(err);
            }
            try{
                rows = rows.filter(item => {
                    return !owners.includes(item.discordid);
                }).slice(0, 10);

                for(let i = 0; i < rows.length; i++){
                    embed.addField(`${i + 1}) ${rows[i].name.slice(0, rows[i].name.length - 5).slice(0, rows[i].name.length - 5)}`, rows[i].beans, true)
                }
                return data.message.channel.send({embed});
            }catch(error) {console.log(error)}
        })

    }
}
