/*const discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const pathToLevels = path.join(__dirname, "../../database/expservers");
const levels = require(path.join(__dirname, "../../database/levels.json"));

module.exports = {
    start(data){
        let serverMembers = data.message.guild.members.array();
        let page, totalPages;
        let userList = [];
        let embed = new discord.MessageEmbed();

        if(data.args.length === 0) page = 1
        else page = Number(data.args[0]);

        if(isNaN(page)) page = 1;

        let files;

        try{
            files = fs.readdirSync(`${pathToLevels}/${data.message.guild.id}`);
        }catch(err) {
            embed.setTitle("📊 Server XP Leaderboard")
                .setColor(0xFFFFFF)
                .setDescription("-----");
            return data.message.channel.send({embed});
        }

        for(let i = 0; i < files.length; i++){
            let output = JSON.parse(fs.readFileSync(`${pathToLevels}/${data.message.guild.id}/${files[i]}`).toString());
            let id = files[i].replace(".json", "");

            userList.push(output);
        }

        userList.sort((a, b) => {
            if(a.level === b.level){
                return b.exp - a.exp
            }
            else{
                return b.level - a.level;
            }
        })

        totalPages = Math.ceil(userList.length / 10);

        if(totalPages === 0) {
            embed.setTitle("📊 Server XP Leaderboard")
                .setColor(0xFFFFFF)
                .setDescription("-----");
            return data.message.channel.send({embed});
        }

        if(page > totalPages) return data.message.channel.send("Selected page exceeds total number of pages.");

        if(page === 1){
            userList = userList.slice(0, 10);
        }else{
            userList = userList.slice((page - 1) * 10 + 1, page * 10)
        }

        embed.setTitle("📊 Server XP Leaderboard")
            .setColor(0xFFFFFF);

        for(let i = 0; i < userList.length; i++){
            embed.addField(`${i + 1}) ${userList[i].name}`, `Level: ${userList[i].level} (XP: ${userList[i].exp}/${levels[userList[i].level + 1]})`)
        }

        embed.setFooter(`page ${page} / ${totalPages}`);

        return data.message.channel.send({embed});

    }
}
*/