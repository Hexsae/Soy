const discord = require("discord.js");

module.exports = {
    async start(data){
        let user;
        let royalList = [];
        let epicList = [];
        let regularList = [];

        if(data.args.length === 0) user = data.message.author;
        else {
            user = await data.soy.users.fetch(data.args[0].replace(/[<@!>]/g, ''));
            if(!user) return data.message.channel.send("Could not find specified user.");
           
        }

        data.db.all("SELECT * FROM badges", (err, badgeList) => {
            data.db.get("SELECT badges, title, tcolor FROM userdata WHERE discordid = ?", [user.id], (err, person) => {
                if(person !== undefined) {
                    person.badges = JSON.parse(person.badges) || []
    
                    for (let i = 0; i < person.badges.length; i++) {
                        let currentBadge = badgeList.find(item => {return item.name.toLowerCase() === person.badges[i]})
                        
                        switch (currentBadge.type) {
                        case "Epic":
                            epicList.push(`:military_medal: ${currentBadge.name}`);
                            break;
                        case "Royal":
                            royalList.push(`:crown: ${currentBadge.name}`);
                            break;
                        case "Regular":
                            regularList.push(`:medal: ${currentBadge.name}`);
                            break;
                        default:
                            break;
                        }
                    }

                    let royalLen = royalList.length,
                        epicLen = epicList.length,
                        regularLen = regularList.length;
    
                    if(royalLen === 0) {
                        royalList = ["---"];
                    }
                    if(epicLen === 0) {
                        epicList = ["---"];
                    }
                    if(regularLen === 0) {
                        regularList = ["---"];
                    }

                    if (!person.tcolor) person.tcolor = 0x32363B;
    
                    embed = new discord.MessageEmbed()
                        .setAuthor(user.username + "'s Badges", url = user.avatarURL())
                        .setColor(person.tcolor)
                        .addField(`Royal (${royalLen})`, royalList.join("\n") , true)
                        .addField(`Epic (${epicLen})`, epicList.join("\n"), true)
                        .addField(`Regular (${regularLen})`, regularList.join("\n"), true);
                    return data.message.channel.send({embed});
                }
                
                else {
                    embed = new discord.MessageEmbed()
                        .setAuthor(user.username + "'s Badges", url = user.avatarURL())
                        .setColor(0x32363B)
                        .addField("Royal (0)", "---", true)
                        .addField("Epic (0)", "---", true)
                        .addField("Regular (0)", "---", true);
                    return data.message.channel.send({embed});
                }
            });
<<<<<<< HEAD

        })

    }

=======
        })
    }
>>>>>>> 81ee908 (Fixes)
};
