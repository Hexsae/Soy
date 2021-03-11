const discord = require('discord.js');

module.exports = {
    start(data) {

        data.db.all("SELECT * FROM userdata", (err, rows) => {
            let beanUsers, totalUsers, embed = new discord.MessageEmbed();
            beanUsers = rows.length;
            totalUsers = data.soy.guilds.cache.array().map(g =>{return g.memberCount}).reduce((acc, val) => {
                return acc + val;
            });

            embed.setColor("RANDOM")
                .setAuthor("Soy bot users!", icon = data.soy.user.avatarURL())
                .addField("Servers", data.soy.guilds.cache.array().length)
                .addField("Bean Users", beanUsers)
                .addField("Total Users", totalUsers);
            return data.message.channel.send({embed})
        })
    }
};