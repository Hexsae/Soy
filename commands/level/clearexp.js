/*const discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const pathToLevels = path.join(__dirname, "../../database/expservers");
const tools = require(path.join(__dirname, "../../tools/functions.js"));

module.exports = {
    async start(data){
        let embed = new discord.MessageEmbed();
        let id = data.args[0];

        if(!tools.isAllowed(data.message, "ADMINISTRATOR")){
            embed.setColor("RED")
                .setDescription("You must be server administrator to clear the server XP.");
            return data.message.channel.send({embed});
        }

        if (id){
            id = id.replace(/[<@!>]/g, '')
            fs.readdir(`${pathToLevels}/${data.message.guild.id}`, (err, files) => {
                files = files.map(f => {return f.replace(".json", '')});

                if (files.includes(id)){
                    let name = JSON.parse(fs.readFileSync(`${pathToLevels}/${data.message.guild.id}/${id}.json`).toString()).name;

                    try{
                        fs.unlinkSync(`${pathToLevels}/${data.message.guild.id}/${id}.json`);
                    }catch(err) {console.log(err)}

                    embed.setColor("GREEN")
                        .setDescription(`Successfully cleared exp for **${name}**`);
                    return data.message.channel.send({embed});
                }
                return data.message.channel.send("Invalid user or user does not have XP on this server.");
            })
        }
        else {
            function filter(mg){
                return mg.author.id === data.message.author.id;
            }

            await data.message.channel.send("Are you sure you would like to wipe all users' XP on this server? (Y/N)");
            
            try{
                let answer = await data.message.channel.awaitMessages(filter, {max: 1});
                answer = answer.array()[0];

                if(answer.content.toLowerCase() !== "y" && answer.content.toLowerCase() !== "yes"){
                    return data.message.channel.send("Cancelled.");
                }

                fs.readdir(`${pathToLevels}/${data.message.guild.id}`, async (err, files) => {
                    if(err) console.warn(err);

                    let mesg = await data.message.channel.send("Clearing server exp...");
                    for (let i =  0; i < files.length; i++){
                        fs.unlinkSync(`${pathToLevels}/${data.message.guild.id}/${files[i]}`);
                    }
                    return mesg.edit(":thumbsup: Successfully cleared server XP.");
                })
            }catch(err) {console.warn(err)};
            
        }

    }
}
*/