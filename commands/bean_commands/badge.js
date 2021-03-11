const discord = require("discord.js");
const badgeList = require("../../database/badges.json");

module.exports = {
    start (data){
        if(data.args.length === 0) return data.message.channel.send("Please specify a badge to display!");
        data.args = data.args.map(arg => {return arg.toLowerCase()});
        
        let badgeName = data.args.join(" ");
        let embed = new discord.MessageEmbed();
        let symbol;

        data.db.get("SELECT * FROM badges WHERE name = ? COLLATE NOCASE", [badgeName], (err, row) => {
            if(err) console.warn(err);
            else{
                if(!row){
                    embed = new discord.MessageEmbed()
                        .setColor("ORANGE")
                        .setDescription(`Could not find badge named **${badgeName}** :cry: `);
                    return data.message.channel.send({embed});
                }

                switch(row.type) {
                    case "Epic":
                        symbol = ":military_medal: ";
                        break;
                    case "Royal":
                        symbol = ":crown: ";
                        break;
                    case "Regular":
                        symbol = ":medal: ";
                        break;
                    default: return;
                }
        
                embed =  new discord.MessageEmbed()
                    .setColor(row.color)
                    .setTitle(`${symbol}${row.name}`)
                    .addField("Type", row.type, true)
                    .addField("Users", row.users, true)
                    .addField("Description", row.description, true);
                return data.message.channel.send({embed});


            }
        })

    }
};
