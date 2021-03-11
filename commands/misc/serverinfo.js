const discord = require('discord.js');

module.exports  = {
    async start(data) {
        let server = data.message.guild;
        let embed, id, roles, len, name;

        if(data.args.length > 0) {
            id = data.args[0];
        }
        else id = data.message.guild.id;

        server = data.soy.guilds.cache;
        server = server.array().find(item => {return item.id === id});

        try {
            roles = server.roles.cache;
            roles = roles.array().map(item => {return item.name})
            roles = roles.filter(ele => {return ele !== '@everyone'});
        }catch(err) {
            return data.message.channel.send("Soy is not in the specified server :'( ")
        }

        len = roles.length;
        if(len > 50){
            name = `★ Roles (${len}) || Displaying highest 50`;
            roles = roles.slice(0, 51);
        }
        else name = `★ Roles (${len})`;

        roles = roles.join(', ');

        let created = `${server.createdAt.toDateString()} - ${server.createdAt.toTimeString()}`; 
        let channels = server.channels.cache;
        let owner = await server.members.fetch(server.ownerID)

        try{
            embed = new discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle("__Server Name__")
                .setDescription(`${server.name}`)
                .addField("★ Owner", owner.user.tag, true)
                .addField("★ Member Count", server.memberCount, true)
                .addField("★ Text & Voice Channels", channels.array().length, true)
                .addField("★ Server ID", server.id, true)
                .setFooter("Created: " + created)
                .addField(name, roles, true)
                .setThumbnail(server.iconURL());
        }catch(err){console.error(err)}
        return data.message.channel.send({embed});
    }
};
