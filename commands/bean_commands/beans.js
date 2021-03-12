const discord = require("discord.js");
const path = require("path");
const mainPath = path.join(__dirname, "../../database");
<<<<<<< HEAD
const fs = require("fs");
let owners = ["242346349859700736", "197478173015932928"];
=======
const owners = require("../../settings.json").owners
const fs = require("fs");
>>>>>>> 81ee908 (Fixes)

module.exports = {
    async start(data){
        let userToShow;
        if(data.args.length > 0){
            userToShow = data.message.mentions.users.first();
            if (!userToShow)
                return data.message.channel.send("Specified user is not in the server or does not exist.");
        }
        else{
            userToShow = data.message.author;
        }
        
         data.db.all("SELECT * FROM userdata WHERE beans >= (SELECT beans FROM userdata WHERE discordid = ?) ORDER BY beans DESC", [userToShow.id], async (error, row) => {
            if(error){
                console.warn("Error: " + String(error));
            }
            let beans, title, tcolor, globalRank, serverRank, user;

            if (row.length === 0){
                beans = 0;
                title = "---";
                globalRank = "Not ranked.";
                serverRank = "Not ranked.";
                tcolor = 0x32363B;
                title = "---"; 
            }
            else{
                user = row.find(element => {
                    return element.discordid === userToShow.id;
                })

                beans = user.beans;
                title = user.title || "---";
                tcolor = user.tcolor || 0x32363B;
<<<<<<< HEAD
                let serverMembers, list =[];
=======
>>>>>>> 81ee908 (Fixes)

                if (owners.includes(user.discordid)){

                    const hax = JSON.parse(fs.readFileSync(mainPath + "/secrethax.json").toString())

                    globalRank = hax[user.discordid]["global rank"];
                    serverRank = hax[user.discordid]["server rank"];
                }
                else{
                    row = row.filter(r => {
                        return !owners.includes(r.discordid);
                    })

                    globalRank = row.findIndex(element => {
                        return element.discordid === userToShow.id;
                    }) + 1;
<<<<<<< HEAD
                
                    serverMembers = data.message.channel.guild.members.fetch()
                        .then(mems => {
                            mems = mems.array();
                            list = [];
=======
                    console.log(1)
                
                    serverMembers = data.message.guild.members.fetch()
                        .then(mems => {
                            mems = mems.array();
                            list = [];
                            console.log(2)
>>>>>>> 81ee908 (Fixes)

                            for(let x = 0; x < mems.length; x++){
                                for(let y = 0; y < row.length; y++){
                                    if(mems[x].id === row[y].discordid){
                                        list.push({id: row[y].discordid, beans: row[y].beans});
                                    }
                                }
                            }
<<<<<<< HEAD

=======
>>>>>>> 81ee908 (Fixes)
                            list.sort((a, b) => {
                                return b.beans - a.beans;
                            })

                            serverRank = list.findIndex(element => {
                                return element.id === user.discordid;
                            }) + 1;
<<<<<<< HEAD

=======
>>>>>>> 81ee908 (Fixes)
                            let embed = new discord.MessageEmbed()
                                .setAuthor(userToShow.username, url = userToShow.avatarURL())
                                .setTitle("Wallet")
                                .setColor(tcolor)
                                .setDescription(beans + " 🥔")
                                .addField("Server Rank", serverRank, true)
                                .addField("Global Rank", globalRank, true)
                                .addField("Title", title, true);
                
                            return data.message.channel.send({embed});
<<<<<<< HEAD
                        })
=======
                        }).catch(console.error)
>>>>>>> 81ee908 (Fixes)
                    return;
                }

            }

            let embed = new discord.MessageEmbed()
                .setAuthor(userToShow.username, url = userToShow.avatarURL())
                .setTitle("Wallet")
                .setColor(tcolor)
                .setDescription(beans + " 🥔")
                .addField("Server Rank", serverRank, true)
                .addField("Global Rank", globalRank, true)
                .addField("Title", title, true);

            return data.message.channel.send({embed});
<<<<<<< HEAD
        
        
=======
>>>>>>> 81ee908 (Fixes)
        })
    }
}
