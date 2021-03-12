const discord = require('discord.js');

let timedUsers = {};

module.exports = {
    start(data){
        let badge = false;
        let embed = new discord.MessageEmbed();
        let alias, prize, answer, win, outcome;

        let betAmount = Number(data.args[0]);
        if(data.args.length < 2) return;
        let choice = data.args[1].toLowerCase();

        let curTime = Date.now();

        if(data.message.author.id in timedUsers && curTime - timedUsers[data.message.author.id] < 2000){
            return data.message.channel.send(`:raised_hand: No spammy spam! You can try again in **${
                Math.ceil((2000 - (curTime - timedUsers[data.message.author.id]))/1000)}** seconds!`)
        }
        timedUsers[data.message.author.id] = Date.now();

        if (isNaN(betAmount) || betAmount % 1 != 0) {
            embed.setColor("RED")
                .setDescription('Invalid bet amount. Type `%betinfo` for info on how to bet!');
            return data.message.channel.send({embed});
        }

        if (!(choice === 'h' || choice === 's')) {
            embed.setColor(0xff0000)
                .setDescription('You can only place your bet on **h** or **s** (happy or sad). Type %betinfo for info on how to bet!');
            return data.message.channel.send({embed});
        }
        if(betAmount < 5){
            embed.setColor("RED")
                .setDescription('You can only bet a minimum of 5 beans!');
            return data.message.channel.send({embed});
        }
        data.db.get('SELECT beans, badges FROM userdata WHERE discordid = ?', [data.message.author.id], (err, person) => {
            if (person === undefined) {
                embed.setColor("RED")
                    .setDescription(`Sorry ${data.message.author.toString()}, you do not have enough beans to make that bet. :pensive:`);
                return data.message.channel.send({embed});
            }
            else if (person.beans < betAmount) {
                embed.setColor(0xff0000)
                    .setDescription(`Sorry ${data.message.author.toString()}, you do not have enough beans to make that bet. :pensive:`);
                return data.message.channel.send({embed});
            }
            answer = Math.floor(Math.random() * 2);

            if (answer === 0) {
                answer = 'h';
                alias = 'Happy'
            }
            else {
                answer = 's';
                alias = 'Sad';
            }
            person.badges = JSON.parse(person.badges) || [];
            let amountToSay;

            if (betAmount >= 10000 && !(person.badges.includes('dare devil'))) {
                person.badges.push('dare devil');
                badge = true;
            }
            if (choice === answer) {
                win = true;
                outcome = 'WINS';
                if (betAmount > 100){
                    prize = (person.beans - betAmount) + Math.round((betAmount * 1.9));
                    amountToSay = Math.round((betAmount * 1.9))
                }
                else {
                    prize = (person.beans - betAmount) + (betAmount * 2);
                    amountToSay = betAmount * 2;
                }


            }
            else {
                prize = person.beans - betAmount;
                win = false;
                outcome = 'LOST';
            }
            let giveAmount;

            if (win) {
                if (badge) {
                    data.db.run("UPDATE badges SET users = users + 1 WHERE name = 'Dare Devil'");
                    
                    embed.setColor("GREEN")
                        .setDescription(`:smiley: ${data.message.author.toString()} bet **${betAmount}** beans and a **${alias} bean** comes out\
 dancing! You win **${amountToSay}** beans *and* :military_medal:**Dare Devil** badge!`);
                }
                else {
                    embed.setColor("GREEN")
                        .setDescription(`:smiley: ${data.message.author.toString()} bet **${betAmount}** beans and a **${alias} bean** comes out\
 dancing! You win **${amountToSay}** beans.`);
                }
            } else {
                if (badge) {
                    data.db.run("UPDATE badges SET users = users + 1 WHERE name = 'Dare Devil'");
                    
                    embed.setColor("RED")
                        .setDescription(`:rage: ${data.message.author.toString()} bet **${betAmount}** beans but a **${alias} bean** comes out\
 instead. On the bright side, you're awarded the :military_medal:**Dare Devil** badge.`)
                }
                else {
                    embed.setColor("RED")
                        .setDescription(`:rage: ${data.message.author.toString()} bet **${betAmount}** beans but a **${alias} bean** comes out\
 instead. Sorry, better luck next time.`);
                }
            }
            data.message.channel.send({embed});

            data.db.run("UPDATE userdata SET name = ?, beans = ?, badges = ? WHERE discordId = ?",
                [data.message.author.tag, prize, JSON.stringify(person.badges), data.message.author.id]);
        });
    }
};
