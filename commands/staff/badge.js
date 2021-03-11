const discord = require('discord.js');
const p = require("path")
const path = p.resolve(__dirname, "../../database/badges.json")
const allBadges = require(path);
const fs = require("fs");

module.exports = {
    async start(data){
        data.args = data.args.map(arg => {return arg.toLowerCase()});
        let embed = new discord.MessageEmbed();
        let user;

        if (data.args.length < 2) {
            embed.setColor(0xff0000)
                .setDescription('Please specify a user to give followed by the badge.\n**Example:**\n   - +badge @user Veteran');
            return data.message.channel.send({embed});
        }
        let badge = data.args.slice(1).join(" ");

        if(!(badge in allBadges)) return data.message.channel.send(`Badge named **${badge}** does not exist. Use \`%badgelist\`` +
            " to view all currently available badges.");

        user = await data.soy.users.fetch(data.args[0].replace(/[<@!>]/g, ''));

        data.db.serialize(() => {
            data.db.run("INSERT OR IGNORE INTO userdata(discordid, beans)" +
            `VALUES(?, '0')`, [user.id]);

            data.db.get("SELECT badges FROM userdata WHERE discordId = ?", [user.id], (err, row) =>  {
                let userBadges = JSON.parse(row.badges) || [];
                if (userBadges.includes(badge)){
                    return data.message.channel.send("User already has that badge.");
                }
                userBadges.push(badge);

                if(badge === "donator"){
                    data.db.run(`UPDATE userdata SET badges = ?, donator=1 WHERE discordId = ?`,
                    [JSON.stringify(userBadges), user.id], (err, row) => {
                        if(err) console.log(err.stack);

                        allBadges[badge].users += 1;
                        fs.writeFile(path, JSON.stringify(allBadges), (err) => {
                            if(err) console.warn(err);
                        });

                        embed.setColor("GREEN")
                            .setDescription(`${user.toString()} has been awarded the \`${allBadges[badge].name}\` badge`)
                        return data.message.channel.send({embed});
                    });
                }else{
                    data.db.run(`UPDATE userdata SET badges = ? WHERE discordId = ?`,
                        [JSON.stringify(userBadges), user.id], (err, row) => {
                            if(err) console.log(err.stack);

                            allBadges[badge].users += 1;
                            fs.writeFile(path, JSON.stringify(allBadges), (err) => {
                                if(err) console.warn(err);
                            });

                            embed.setColor("GREEN")
                                .setDescription(`${user.toString()} has been awarded the \`${allBadges[badge].name}\` badge`)
                            return data.message.channel.send({embed});
                        });
                }

                data.db.run("UPDATE badges SET users = users + 1 WHERE name = ?", [allBadges[badge].name])
            });
        })


    }
};