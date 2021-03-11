const discord = require('discord.js');
const path = require("path");
const tools = require(path.join(__dirname, "../../tools/functions.js"));

module.exports = {
    async start(data){
        if(!tools.isAllowed(data.message, "MANAGE_MESSAGES")){
            let embed = new discord.RichEmbed()
                .setDescription("You need to have `Manage Messages` permission to be able to delete messages from the chat.")
                .setColor(0xFF0000);
            return data.message.channel.send({embed})
        }

        let numberOfMessages = Number(data.args[0]);
        if(!numberOfMessages) return data.message.channel.send('Please specify the number of messages to delete or add @user after the number of messages. ' +
            'Type `%help purge` for more info!');

        if(data.args.length > 1){
            try {
                if(isNaN(numberOfMessages)) return data.message.channel.send("Invalid number of messages to delete. Type `%help purge` for the correct format.");

                let user = data.message.guild.member(data.args[1].replace(/[<@!>]/g, ''));
                if(!user) return data.message.channel.send("Invalid user. Type `%help purge` for more info.");

                let messageList = await data.message.channel.fetchMessages({limit: 100});
                messageList = messageList.array().filter(mg =>
                {return mg.author.id === user.id});

                let limit = numberOfMessages + 1;

                messageList = messageList.slice(0, limit);
                try {
                    await data.message.channel.bulkDelete(messageList);
                }catch(err) {console.log(err.message)}

            }catch(err) {return console.warn(err);}
        }else {
            if (isNaN(numberOfMessages)) return;
            if (numberOfMessages >= 100) {
                let start = numberOfMessages, mg;

                while (numberOfMessages >= 100) {
                    try {
                        await data.message.channel.bulkDelete(99);
                        numberOfMessages -= 99;
                    } catch(err) {
                        if(err.code === 50034){
                            embed = new discord.MessageEmbed()
                                .setDescription("Cannot bulk delete messages older than 14 days. Use `%xpurge` instead.")
                                .setColor("RED");
                            return data.message.channel.send({embed});
                        }
                        else{
                            embed = new discord.MessageEmbed()
                                .setDescription("I need to have **Manage Messages** permission to be able to delete messages!")
                                .setColor(0xFF0000);
                            return data.message.channel.send({embed});
                        }
                    }
                }
                if(numberOfMessages > 0) await data.message.channel.bulkDelete(numberOfMessages);
                //await data.message.channel.send('Deleted ' + String(start) + " messages.");
            }
            else {
                try {
                    await data.message.channel.bulkDelete(numberOfMessages +1);
                }catch(err) {
                    if(err.code === 50034){
                        embed = new discord.MessageEmbed()
                            .setDescription("Cannot bulk delete messages older than 14 days. Use `%xpurge` instead.")
                            .setColor("RED");
                        return data.message.channel.send({embed});
                    }
                    else{
                        embed = new discord.MessageEmbedd()
                            .setDescription("I need to have **Manage Messages** permission to be able to delete messages!")
                            .setColor(0xFF0000);
                    }
                }
            }
        }

    },
};