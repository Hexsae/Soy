const Discord = require("discord.js");
module.exports = {
    async start(data){
        if(data.args.length === 0 && data.message.attachments.array().length === 0)
            return data.message.channel.send("You did not specify a message to send.");
        let messageToSend = data.args.join(" ");

        data.message.delete()
            .then(success => {}, failure=>{});
            
        data.message.channel.send(messageToSend);
        if(data.message.attachments.array().length > 0){
            for(let i=0;i<data.message.attachments.array().length;i++){
                data.message.channel.send({files:[new Discord.Attachment(data.message.attachments.array()[i].url)]});
            }
        }
    }
}