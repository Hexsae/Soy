const discord = require('discord.js');
const tools = require("../../tools/functions.js");

let timedUsers = {};

let map = {
    100: 200,
    50: 75,
    20: 50
};

module.exports = {
    async start(data){
        let curTime = Date.now();
        if(data.message.author.id in timedUsers && curTime - timedUsers[data.message.author.id] < 10000){
            return data.message.channel.send(`:raised_hand: No spammy spam! You can try again in **${
                Math.ceil((10000 - (curTime - timedUsers[data.message.author.id]))/1000)}** seconds!`)
        }
        timedUsers[data.message.author.id] = Date.now();

        let choice = Number(data.args[0]);

        if (isNaN(choice) || !(choice in map)) return data.message.channel.send(
            `Sorry **${data.message.author.username}**, I only accept the numbers 20, 50, or 100. eg %play 50.`);

        let variable = tools.soyRandom(1, choice + 1);

        await data.message.channel.send(`I'm thinking of a number from 1 to ${choice}. If you can get the number right, you win` +
            ` **${map[choice]}** beans! Reply with your choice. You have 10 seconds.`);

        let mg2
        try{
            mg2 = await data.message.channel.awaitMessages(mg => {
                return mg.author.id === data.message.author.id && !isNaN(Number(mg.content))
            }, {max: 1, time: 10000, errors: ["time"]});
        }catch(err){
            return;
        }

        mg2 = mg2.array()[0];
        if (Number(mg2.content) === variable) {
            if (choice === 100) {
                data.db.run("INSERT OR IGNORE INTO UserData (discordid, beans)"+
                    `VALUES(?, '0')`, [data.message.author.id]);

                data.db.get("SELECT badges FROM userdata WHERE discordid = ?", [data.message.author.id], (err, row) => {
                    row.badges = JSON.parse(row.badges) || [];

                    if(!row.badges.includes("guess expert")) {
                        row.badges.push("guess expert");

                        data.db.run("UPDATE badges SET users = users + 1 WHERE name = 'Guess Expert'");

                        data.db.run("UPDATE userdata SET name = ?, beans = beans + ?, badges = ?" +
                            " WHERE discordid = ?", [data.message.author.tag, map[choice], JSON.stringify(row.badges), data.message.author.id]);

                        return data.message.channel.send(`:tada: Congratz ${data.message.author.toString()}! You win **${map[choice]}** beans for guessing the` +
                            " right number! You're also awarded the **Guess Expert** badge! " +
                            "You can type `%beans` to view your new amount and \`%badges\` to view your badges.");
                    }
                    data.db.run("UPDATE userdata SET name = ?, beans = beans + ?" +
                        " WHERE discordid = ?", [data.message.author.tag, map[choice], data.message.author.id]);

                    return data.message.channel.send(`:tada: Congratz ${data.message.author.toString()}! You win **${map[choice]}** beans for guessing the` +
                        " right number! You can type `%beans` to view your new amount.");
                })

            }else {
                data.db.run("INSERT OR IGNORE INTO userdata (discordid, beans)"+
                    `VALUES(?, '0')`, [data.message.author.id]);

                data.db.run("UPDATE userdata SET name = ?, beans = beans + ?"+
                    " WHERE discordid = ?", [data.message.author.tag, map[choice], data.message.author.id]);

                return data.message.channel.send(`:tada: Congratz ${data.message.author.toString()}! You win **${map[choice]}** for guessing the` +
                    " right number! You can type `%beans` to view your new amount.")
            }

        }else{ return data.message.channel.send(`Wrong! I was actually thinking of the number ${variable}.`)}
    }
};
