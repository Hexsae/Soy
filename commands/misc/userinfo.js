const discord = require('discord.js');

module.exports = {
    async start(data){
        let embed = new discord.MessageEmbed();
        let id, roles, nick, member;

        if(data.args.length > 0){
            id = data.args[0].replace(/[<!@>]/g, '');
        }
        else id = data.message.author.id;

        member = await data.message.guild.members.fetch(id);
        if(!member) return data.message.channel.send("Could not find specified user :cry: .");
        roles = (member.roles.cache.array().map(item => {return item.name})).filter(role => {return role !== "@everyone"}).join(', ');

        if (!roles) roles = "---"

        if(!member.nickname) nick = "---";
        else nick = member.nickname;
        try{
            embed
                .setColor("RANDOM")
                .setAuthor(member.user.tag, icon = member.user.avatarURL())
                .addField("★ Nickname", nick, true)
                .addField("★ ID", member.id, true)
                .addField("★ Joined Server", member.joinedAt.toDateString(), true)
                .addField("★ Created Discord", member.user.createdAt.toDateString(), true)
                .addField("★ Roles", roles, true)
                .setThumbnail(member.user.avatarURL());
        }catch(err){console.error(err)}

        return data.message.channel.send({embed});

    }
};