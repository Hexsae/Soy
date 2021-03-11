const discord = require("discord.js");

module.exports = {
    start(data){
        let embed = new discord.MessageEmbed();
        let receiver;
        let giver = data.message.author;
        let amount = Number(data.args[1]);

        if (data.args.length < 2) {
            embed.setDescription("Please specify the user and the amount of beans to give.");
            return data.message.channel.send({embed});
        }

        if (isNaN(amount) || amount.toString().indexOf(".") !== -1) {
            embed.setDescription("Invalid amount. Type `%help give` for examples.")
                .setColor("RED")
            return data.message.channel.send({embed});
        }

        if(amount < 0){
            embed.setDescription("You can't gift a negative amount silly :yum: ")
                .setColor("RED")
            return data.message.channel.send({embed});
        }

        receiver = data.message.mentions.users.first();
        if(!receiver) return data.message.channel.send("User is not in the server or does not exist. Type `%help give` for examples.");
        
        if (receiver === giver) return data.message.channel.send("*Throws friendship*... now stop trying to gift yourself :pensive:");
        if (receiver === data.soy.user) return data.message.channel.send("How cute but soy does not need your worthless beans c:");

        //Check if giver has enough beans
        data.db.get("SELECT * FROM userdata WHERE discordid = ?", [giver.id], (error, row) => {
            if (row === undefined) return data.message.channel.send("You do not have enough beans to make that transaction.");
            else if (row.beans < amount) return data.message.channel.send("You do not have enough beans to make that transaction.");

            let badges = JSON.parse(row.badges) || [];

            data.db.serialize(() => {
                data.db.run("INSERT OR IGNORE INTO userdata(discordid, beans) VALUES(?,?)", [receiver.id, 0])
                //receiver
                data.db.run("UPDATE userdata SET beans = beans + ?, name = ? WHERE discordid = ?", [amount, receiver.tag, receiver.id]);
            })

            if(amount >= 15000 && !badges.includes("generous")){
                badges.push("generous");
                data.db.run("UPDATE userdata SET beans = beans - ?, badges = ? WHERE discordid = ?", [amount, JSON.stringify(badges), giver.id]);
                
                //updating count
                data.db.run("UPDATE badges SET users = users + 1 WHERE name = 'Generous'");

                embed.setDescription(`<@${giver.id}> has successfully given <@${receiver.id}> **${amount}** beans! You're also awarded the :medal: \`Generous\` badge for gifting at least 15k beans!`)
                    .setColor("GREEN");
                return data.message.channel.send({embed});
            }
            else{
                data.db.run("UPDATE userdata SET beans = beans - ? WHERE discordid = ?", [amount, giver.id]);

                embed.setDescription(`<@${giver.id}> has successfully given <@${receiver.id}> **${amount}** beans!`)
                    .setColor("GREEN");
                return data.message.channel.send({embed});
            }
        })
    }
}
