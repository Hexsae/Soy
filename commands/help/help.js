const discord = require("discord.js");
const info = require('../../database/info.json').regularCommands;

module.exports = {
    start(data) {
        let embed =  new discord.MessageEmbed(), cmd, description, examples;
        if (data.args.length === 0) {
            embed = new discord.MessageEmbed()
                .setAuthor("Soy bot help", icon = data.soy.user.avatarURL)
                .setColor("PURPLE")
                .addField("Commands List", "Type %commands", true)
                .addField("Invite Link", "[Invite me!](https://discordapp.com/oauth2/authorize?client_id=268479232731119617&scope=bot&permissions=8192)", true);
            return data.message.channel.send({embed});
        }

        cmd = data.args[0].replace("%", "");

        if (!(cmd in info)){
            return data.message.channel.send(`Command named **${cmd}** not found :'(`);
        }
        if ("alias" in info[cmd]){
            description = info[info[cmd].alias].longDescription;
            examples = info[info[cmd].alias].examples;
            embed.setFooter('Alias for %' + info[cmd].alias)
        }
        else{
            description = info[cmd].longDescription;
            examples = info[cmd].examples;
        }

        embed.setTitle(':bulb: Info on command %' + cmd)
            .setColor(0xFFFFFF)
            .addField("Description", description)
            .addField("Example", examples);

        return data.message.channel.send({embed});
    }
};
