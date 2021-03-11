const fs = require("fs");
const banList = require("../../database/banlist.json");
const discord = require("discord.js");

module.exports = {
    async start(data){
        if(data.args.length < 2){
            return data.message.channel.send("Please specify the user id and the reason for ban");
        }
        const reason = data.args.slice(1).join(" ");
        let user = await data.soy.users.fetch(data.args[0]);

        if (!user) user = data.args[0];
        else{
            user = `${user.tag}\n${user.id}`;
        }

        banList[data.args[0]] = {
            "username": user,
            "reason": reason,
            "time": `${new Date().toDateString()} at ${new Date().toLocaleTimeString()}`

        };
        
        fs.writeFile("/root/Soybot/database/banlist.json", JSON.stringify(banList), err =>{
            console.log("An error occured adding user to banlist: " + String(err));
        })
        
        const embed = new discord.MessageEmbed()
            .setTitle("User banned!")
            .attachFiles("/root/Soybot/banned.png")
            .setThumbnail("attachment://banned.png")
            .addField(`User:`, user)
            .addField("Reason:", data.args.slice(1).join(" "))
            .setColor("PURPLE");
        data.message.channel.send({embed});
    }
}
