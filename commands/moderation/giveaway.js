const discord = require("discord.js");
const path = require("path");
const fs = require("fs");
const tools = require(path.join(__dirname, "../../tools/functions.js"));
const giveaways = require(path.join(__dirname, "../../database/giveaways.json"));
const stringify = require("json-stringify-safe");

module.exports = {
    async start(data){
        let embed = new discord.RichEmbed();

        //Change implementation to check if the author is admin to start the event
        //We can just change it to check if the author is one of our staff
        /*if(!tools.isAllowed(data.message, "ADMINISTRATOR")){
            embed.setColor("RED")
                .setDescription("You must be server admin to start/end a giveaway.");
            return data.message.channel.send({embed});
        }*/
        if (!(data.message.author.id === "197478173015932928")){
            return;
        }

        if (data.args.length < 2){
            embed.setColor("RED")
                .setDescription("You must specify a time (in seconds) followed by the giveaway item. Type `%help giveaway` for more info.");
            return data.message.channel.send({embed});
        }

        let time = Number(data.args[0]);
        let prize = data.args.slice(1).join(" ");

        if (isNaN(time)){
            embed.setColor("RED")
                .setDescription("Invalid time. Type `%help giveaway` for more info.");
            return data.message.channel.send({embed});
        }

        //Can adjust time of the event if need be
        if(time > 43200)
            return data.message.channel.send("Time cannot be greater than 12 hours (43200 seconds)");
        else if(time < 3)
            return data.message.channel.send("Time cannot be less than 3 seconds.");

        embed.setColor("PURPLE")
            .setTitle("🎀GIVEAWAY EVENT")
            .setDescription("React to this message with a 🎀 to enter!")
            .addField("PRIZE", `**${prize}**`)
            .addField("DURATION", `${tools.converter(time)}`);//Just converts the time in seconds to {hours} {minutes} {seconds}

        mg = await data.message.channel.send({embed});
        await mg.react("🎀");
        //giveaways[data.message.createdTimestamp] = mg;

        //fs.writeFileSync(path.join(__dirname, "../../database/giveaways.json"), stringify(giveaways))
        
        setTimeout(async () => {
            //let newMg = await data.message.channel.fetchMessage(mg.id);
            let reactionEmoji = mg.reactions.find(r =>{return r.emoji.toString() === "🎀"})
            let participants = await reactionEmoji.fetchUsers();

            //Will have to change "data.soy.user.id" to the bot's id
            //so it doesn't count itself as a participant
            participants = participants.array().filter(user =>{return user.id !== data.soy.user.id});
            
            let embed = new discord.RichEmbed();
            if (participants.length === 0){
                embed.setTitle("🎀GIVEAWAY EVENT ENDED")
                    .setColor("ORANGE")
                    .setDescription(`There was no winner for this event =(.`)
                    .addField("Participants", 0)
                mg.edit({embed});

                 //Messaging the person who started the event
                 data.message.author.send({embed: {
                    description: `Your giveaway in **${data.message.guild.name}** has ended! Unfortunately there was no winner.`,
                    color: 3447003
                }})
                return;
            }
            //Random select from the list of particpants
            let winner = tools.soyChoice(participants);

            embed.setTitle("🎀GIVEAWAY EVENT ENDED")
                .setColor("ORANGE")
                .setDescription(`Congratulations **${winner.username}**! You won **${prize}**.`)
                .addField("Participants", participants.length)
            mg.edit({embed});
            data.message.channel.send(`<@${winner.id}>`)
            
            //Messaging the person who started the event
            data.message.author.send({embed: {
                description: `Your giveaway in **${data.message.guild.name}** has ended! The winner was: ${winner.username}`,
                color: 3447003
            }})
        }, time*1000);
    }
}