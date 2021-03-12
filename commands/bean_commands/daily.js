const fs = require("fs");
const tools = require("../../tools/functions.js");
const discord = require("discord.js");

let timedUsers = {};
const except = [""];

module.exports = {
    start(data){
        let curTime = Date.now();
        let embed = new discord.MessageEmbed();
        let prize;
        let choice = tools.soyRandom(0, 101);

        data.db.serialize(() => {
            data.db.run("INSERT OR IGNORE INTO userdata (discordId, name, beans) VALUES" +
                    " (?, ?, '0')", [data.message.author.id, data.message.author.tag], (err, row) => {
                    if(err) console.log("--ERROR in %daily:  " + err);
                    }
            );

            data.db.get("SELECT * FROM userdata WHERE discordid = ?", [data.message.author.id], (err, row) => {
                if(row){
                    row.inventory = JSON.parse(row.inventory) || [];

                    if(row.inventory.includes("Daily spin reset")){
                        row.inventory.splice(row.inventory.indexOf("Daily spin reset"), 1);
                    }
                    else if (data.message.author.id in timedUsers && curTime - timedUsers[data.message.author.id] < 86400000 && !(except.includes(data.message.author.id))){
                        embed.setDescription(`${data.message.author.toString()}, you can get your next daily spin in **${
                            tools.converter(Math.ceil((86400000 - (curTime - timedUsers[data.message.author.id]))/1000))}**:clock3:. \
                            You can purchase a daily spin reset from the shop if you don't want to wait!`)
                            .setColor("ORANGE");
                        return data.message.channel.send({embed});
                    }
                }
        
                timedUsers[data.message.author.id] = Date.now();
                let dailyCoupon = false;
                
                if (choice <= 45) prize = 40;
                else if (choice >= 45 && choice < 74) {
                    prize = 40;
                    dailyCoupon = true;
                }
                else if (choice >= 74 && choice < 94) prize = 100;
                else if (choice >= 94 && choice < 100) prize = 250;
                else prize = 500; 

                row.badges = JSON.parse(row.badges) || [];

                if (prize === 300 && !(row.badges.includes("lucky gun"))) {
                    row.badges.push("lucky gun");
                    data.db.run("UPDATE userdata SET beans = beans + ?, badges = ?, inventory = ? WHERE discordId  = ?"
                        , [prize, JSON.stringify(row.badges), JSON.stringify(row.inventory), data.message.author.id]);

                    //Updating count
                    data.db.run("UPDATE badges SET users = users + 1 WHERE name = 'Lucky Gun'");
                    
                    let embed = new discord.MessageEmbed()
                        .setColor("AQUA")
                        .setDescription(`:calendar_spiral: ${data.message.author.toString()} spins the Bean Wheel and it stops on a `+
                        `${choice}. You win **${prize} beans**! You also get the \`Lucky Gun\` badge!`);
                    data.message.channel.send({embed});
                }
                else{
                    data.db.run("UPDATE userdata SET beans = beans + ?, inventory = ? WHERE discordId  = ?"
                        , [prize, JSON.stringify(row.inventory), data.message.author.id]);

                    if (dailyCoupon){
                        delete timedUsers[data.message.author.id];

                        embed.setColor("AQUA")
                            .setDescription(`:calendar_spiral: ${data.message.author.toString()} spins the Bean Wheel and it stops on a `+
                            `${choice}. You win **${prize} beans** and a **free daily spin!**`);
                        return data.message.channel.send({embed});
                    }
                        
                    embed.setColor("AQUA")
                        .setDescription(`:calendar_spiral: ${data.message.author.toString()} spins the Bean Wheel and it stops on a `+
                        `${choice}. You win **${prize} beans**!`);
                    data.message.channel.send({embed});
                }
            })
        })
    }
};
