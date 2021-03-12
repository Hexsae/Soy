<<<<<<< HEAD
const levels = require("../database/levels.json");
=======
>>>>>>> 81ee908 (Fixes)
const discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("../database/info.json");

class Tools{
    static soyRandom(start, end){
        return Math.floor(Math.random() * (end - start)) + start;
    }

    static soyChoice(options){
        let limit = options.length;
        let choice = this.soyRandom(0, limit);
        return options[choice];
    }
    
    static converter(time){
        let hours, minutes, seconds;

        hours = Math.floor(time / 3600);
        time %= 3600;
        minutes = Math.floor(time / 60);
        seconds = time % 60;

        if(hours === 0 && minutes === 0)
            return(`${seconds} seconds`);
        else if (hours === 0 && minutes !== 0)
            return(`${minutes} mins and ${seconds} secs`);
        else
            return(`${hours} hrs ${minutes} mins and ${seconds} secs`);
    }

<<<<<<< HEAD
    static handleExp(guildId, user, userData){
        let expGained =  this.soyRandom(10, 16);
        let levelUp = false;
        userData.name = user.tag;

        if (userData.exp + expGained >= levels[userData.level + 1]){
            levelUp = true;
            userData.exp = 0;
            userData.level += 1;
        }
        else{
            userData.exp += expGained;
        }

        fs.writeFile(path.join(__dirname, `../database/expservers/${guildId}/${user.id}.json`), JSON.stringify(userData), err => {
            if(err) console.warn("Err handling new exp: " + err);
        });

        return {levelUp: levelUp, newLevel: userData.level};
    }

=======
>>>>>>> 81ee908 (Fixes)
    static isAllowed(ctx, permission){
        if(!(ctx.guild.member(ctx.author).hasPermission(permission)) && !(ctx.author.id in config.staffMembers)){
         return false;
        }
        return true;
    }

    static addRoleToShop(data, role, price){
        let embed = new discord.RichEmbed();

        data.db.serialize(() => {
            data.db.run("INSERT OR IGNORE INTO roleshop(serverid, servername) VALUES(?, ?)", [data.message.guild.id, data.message.guild.name])
            data.db.get("SELECT roles FROM roleshop WHERE serverid = ?", [data.message.guild.id], (err, row) => {
                let serverRoles = JSON.parse(row.roles);
                for(let i = 0; i < serverRoles.length; i++){
                    if (role.id === serverRoles[i].id) {
                        embed.setColor("RED")
                            .setDescription("That role is already in the role shop.");
                        return data.message.channel.send({embed});
                    }
                }

                serverRoles.push({name: role.name, id: role.id, price: price});
                data.db.run("UPDATE roleshop SET roles=?, lastupdate=? WHERE serverid=?", [JSON.stringify(serverRoles), new Date().toDateString(), data.message.guild.id]);
                
                embed.setColor("PURPLE")
                    .setDescription(`Successfully added ${role.name} to the role shop.`);
                return data.message.channel.send({embed});
            })
        })
    }

    static removeRoleFromShop(data, role){

    }

    static buyRole(data, user, role){

    }
}

module.exports = Tools;
