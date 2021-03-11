const discord = require("discord.js");

module.exports = {
    start(data){
        if(data.args.length === 0){
            return data.message.channel.send("You did not specify an item from the shop to buy.");
        }
        let embed = new discord.MessageEmbed()
            .setColor("PURPLE");

        let itemName = data.args.join(" ").toLowerCase();

        data.db.get("SELECT * FROM beanshop WHERE name = ? COLLATE NOCASE", [itemName], (err, item) => {
            if(!item) return data.message.channel.send(`Item **${itemName}** does not exist in the shop.`);
            data.db.get("SELECT * FROM userdata WHERE discordid = ?", [data.message.author.id], (err, user) => {
                if(!user) return data.message.channel.send("You do not have enough beans to buy this item.");
                else if(user.beans < item.price) return data.message.channel.send("You do not have enough beans to buy this item.");
                let success = true;

                if(item.category === "Wallet Color"){
                    console.log(item);
                    if(item.exclusive === "Donator exclusive"){
                        if(!user.donator){
                            success = false;
                            return data.message.channel.send("This item is a donator exclusive. You need to be a donator to purchase this.")
                        }
                        else{
                            data.db.run("UPDATE userdata SET tcolor = ?, beans = beans - ? WHERE discordid = ?", [item.autouse, 0, data.message.author.id]);
                        }
                    }
                    else{
                        data.db.run("UPDATE userdata SET tcolor = ?, beans = beans - ? WHERE discordid = ?", [item.autouse, item.price, data.message.author.id]);
                    }
                }
                else{
                    let userInv = JSON.parse(user.inventory) || [];
                    userInv.push(item.name);
                    data.db.run("UPDATE userdata SET beans = beans - ?, inventory = ? WHERE discordid = ?", [item.price, JSON.stringify(userInv), data.message.author.id]);
                }

                if(success){
                    embed.setDescription(`You have successfully bought **${item.name}** for **${item.price}** beans!`);
                    return data.message.channel.send({embed});
                }
            })
        })
    }
}