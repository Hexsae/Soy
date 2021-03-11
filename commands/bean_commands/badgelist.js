const discord = require("discord.js");

module.exports = {
    start(data) {
        let embed = new discord.MessageEmbed();
        let royalList = [], epicList = [], regularList = [];

        data.db.all("SELECT * FROM badges", (err, badgeList) => {
            let len = badgeList.length;
            
            for (let i in badgeList) {
                switch (badgeList[i].type) {
                    case "Epic":
                        epicList.push(`:military_medal: ${badgeList[i].name}`);
                        break;
                    case "Royal":
                        royalList.push(`:crown: ${badgeList[i].name}`);
                        break;
                    case "Regular":
                        regularList.push(`:medal: ${badgeList[i].name}`);
                        break;
                    default:
                        break;
                }
            }
            embed = new discord.MessageEmbed()
                .setColor(0xFFFFF)
                .setDescription("Type `%badge <name>` for more info on a badge and `%badges` to list your badges!")
                .setAuthor(`ALL available badges (${len}):`, url = data.soy.user.avatarURL())
                .addField(`Royal (${royalList.length})`, royalList.sort().join("\n") , true)
                .addField(`Epic (${epicList.length})`, epicList.sort().join("\n"), true)
                .addField(`Regular (${regularList.length})`, regularList.sort().join("\n"), true);
            return data.message.channel.send({embed});
        })        
        
    }
};
