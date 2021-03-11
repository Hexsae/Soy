const discord = require('discord.js');

module.exports = {
    async start(data){
        let listOfUsers = [], embed;

        if (!data.args[0]) return data.message.channel.send("Please specify the amount of beans this event will award!");
        let amount = Number(data.args[0]);
        if (isNaN(amount)) return;

        embed = new discord.MessageEmbed()
            .setDescription(`A legendary meteor has fallen, in it contains a rare drop of the spiciest soybeans. ` +
                `To get a taste, react to this message with :hot_pepper: and get **${amount}** beans!`)
            .setColor(0xFFE4C5)
            .setTitle('Beans Event');
        try{
            await data.message.delete();
        }catch(err){};
        
        data.message.channel.send({embed})
            .then(message => {
                message.react('🌶');

                data.soy.on('messageReactionAdd', (messageReaction, User) => {
					if(messageReaction.message.id !== message.id) return;
					
                    if (!listOfUsers.includes(User.id) && !User.bot) {
                        listOfUsers.push(User.id);
                        
                        data.db.run("INSERT OR IGNORE INTO userdata(discordid, beans) VALUES"+
                            `(?, '0')`, [User.id]);

                        data.db.run('UPDATE userdata SET beans = beans + ?, name = ?, reactions = reactions + "1" WHERE discordid = ?',
                        [amount, User.tag, User.id]);
                    }
                })
                message.delete({timeout: 3600000}).catch(err => {console.log("-Event already deleted.")});
            }, fail => {
                console.warn(fail.message);
            });

        data.db.run("UPDATE soy SET totalevents = totalevents + 1");
    }
};
