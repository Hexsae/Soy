const discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const tools = require(path.join(__dirname, "../../tools/functions.js"));
const pathToWelcomeServers = path.join(__dirname, "../../database/welcomeservers");

module.exports = {
    async start(data){
        let embed = new discord.MessageEmbed();

        if(!tools.isAllowed(data.message, "MANAGE_GUILD")){
            embed.setColor("RED")
                .setDescription("You must have `Manage Server` permission to set the autorole.");
            return data.message.channel.send({embed});
        }

        if(data.args.length === 0){
            return data.message.channel.send("Could not find that role in the server :(!");
        }

        let role = data.args[0].replace("<@&", "").replace(">", "");
        role = await data.message.guild.roles.fetch(role);

        if(!role){
            return data.message.channel.send("Could not find that role in the server :(!");
        }

        try{
            let fd = fs.openSync(`${pathToWelcomeServers}/${data.message.guild.id}.json`, 'r');
            fs.close(fd, err => {});
        }catch(err){
            let format = JSON.stringify({
                autorole: role.id
            })
            fs.writeFileSync(`${pathToWelcomeServers}/${data.message.guild.id}.json`, format);
            embed.setColor(roleObject.color)
                .setDescription(`Automatically assigning role ${role.name} to new users :white_check_mark: `);
                    
            data.message.channel.send({embed});
            return;
        }

        let file = JSON.parse(fs.readFileSync(`${pathToWelcomeServers}/${data.message.guild.id}.json`));
        file.autorole = role.id;
        fs.writeFileSync(`${pathToWelcomeServers}/${data.message.guild.id}.json`, JSON.stringify(file));
            embed.setColor(role.color)
                .setDescription(`Automatically assigning role ${role.name} to new users :white_check_mark: . Ensure I have the \`Manage Roles\` permission for this feature to work.`);
                    
            data.message.channel.send({embed});
            return;
    }
}
