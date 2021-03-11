module.exports = {
    async start(data){
        if(data.args.length < 2){
            return data.message.channel.send("Please specify the user id and the message to send");
        }
        try{
            let user = await data.soy.users.fetch(data.args[0]);
            if(!user) return data.message.channel.send("Invalid user");

            let dmChannel = await user.createDM();
            dmChannel.send(data.args.slice(1).join(" "));
        }catch(err){return data.message.channel.send(err)}

        data.message.channel.send("Sent DM! :thumbsup:");
    }
}