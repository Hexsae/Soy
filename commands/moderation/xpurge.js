const discord = require('discord.js');

let op = ["242346349859700736", "197478173015932928"]

module.exports = {
    async start(data){
        if(!op.includes(data.message.author.id)) return;

        if (!(data.message.guild.member(data.message.author).hasPermission("MANAGE_MESSAGES"))) {
            let embed = new discord.RichEmbed()
                .setDescription("You need to have **Manage Messages** permission to be able to `%purge`.")
                .setColor(0xFF0000);
            return data.message.channel.send({embed})
        }

        let numberOfMessages = Number(data.args[0]);
        if(!numberOfMessages) return data.message.channel.send('Please specify the number of messages to delete or add @user after the number of messages. ' +
            'Type `%help xpurge` for more info!');

        if(data.args.length > 1){
            try {
                if(isNaN(numberOfMessages)) return data.message.channel.send("Invalid number of messages to delete. Type `%help xpurge` for the correct format.");

                let user = data.message.guild.member(data.args[1].replace(/[<@!>]/g, ''));
                if(!user) return data.message.channel.send("Invalid user. Type `%help xpurge` for more info.");

                let messageList = await data.message.channel.fetchMessages({limit: 100});
                messageList = messageList.array().filter(mg =>
                {return mg.author.id === user.id});

                let limit = numberOfMessages + 1;

                messageList = messageList.slice(0, limit);

                let index = 0;
                setInterval(async () => {
                    if(index === messageList.length){
                        return
                    }
                    try{
                        await messageList[index].delete();
                    }catch(err) {
                        if(err.code === 50013){
                            embed = new discord.RichEmbed()
                                .setDescription("I need to have **Manage Messages** permission to be able to delete messages!")
                                .setColor(0xFF0000);
                            return data.message.channel.send({embed});
                        }
                        else{
                            console.warn(err);
                        }
                    }
                    index++;
                }, 1200);

            }catch(err) {return console.warn(err)}
        }else {
            if (isNaN(numberOfMessages)) return;

            let messageList = await data.message.channel.fetchMessages({limit: numberOfMessages + 1});
            messageList = messageList.array();
            let index = 0;

            setInterval(async () => {
                if(index === messageList.length){
                    return
                }
                try{
                    await messageList[index].delete();
                }catch(err) {
                    if(err.code === 50013){
                        embed = new discord.RichEmbed()
                            .setDescription("I need to have **Manage Messages** permission to be able to delete messages!")
                            .setColor(0xFF0000);
                        return data.message.channel.send({embed});
                    }
                    else{
                        console.warn(err);
                    }
                }
                index++;
            }, 1500);
        }

    },
};