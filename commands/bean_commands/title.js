const discord = require('discord.js');

module.exports = {
    start(data) {
        data.args = data.args.map(arg => {return arg.toLowerCase()});
        let embed = new discord.MessageEmbed();
        let title = data.args.join(' ');

        if(!title) return data.message.channel.send("Please specify a title you would like to set. (Title must be one of your badges)");

        data.db.get("SELECT badges FROM userdata WHERE discordId = ?", [data.message.author.id], (err, row) => {
            if (!row) return data.message.channel.send('You do not have' +
                ` badge named **${title}** to set as your title. Type \`%badges\` to view your badges.`);
            row.badges = JSON.parse(row.badges) || [];

            if (!(row.badges.includes(title))) return data.message.channel.send('You do not have' +
                ` badge named **${title}** to set as your title. Type \`%badges\` to view your badges.`);
            
            data.db.get("SELECT * FROM badges WHERE name = ? COLLATE NOCASE", [title], (err, badge) => {
                data.db.run("UPDATE userdata SET title = ? WHERE discordId = ?",
                [badge.name, data.message.author.id]);

                embed = new discord.MessageEmbed()
                    .setColor("PURPLE")
                    .setDescription(`You have successfully set your title to **${badge.name}**!`);
                return data.message.channel.send({embed})

            })
            
        })
    }
};
