const discord = require("discord.js");
const path = require("path");
const tools = require(path.join(__dirname, "../../tools/functions.js"));

module.exports = {
    start(data){
        let embed = new discord.RichEmbed();

        if(data.args.length > 0){
            if(data.args.length !== 3){
                return data.message.channel.send("Missing arguments. Type `%help roleshop` for more info with examples.");
            }
            if((data.args[0] !== "add" && data.args[0] !== "remove" && data.args[0] !== "buy") || isNaN(Number(data.args[2]))){
                return data.message.channel.send("Invalid format. Type `%help roleshop` for more info with examples.");
            }

            let role = data.message.mentions.roles.first();
            if(!role){
                return data.message.channel.send("Could not find role in the server. Type `%help roleshop` for more info with examples.")
            }
            else if(role.toString() !== data.args[1]){
                return data.message.channel.send("Invalid role. Type `%help roleshop` for more info with examples.")
            }

            switch(data.args[0]){
                case "add":
                    if (!tools.isAllowed(data.message, "MANAGE_ROLES")) return data.message.channel.send(":x: You need the manage roles permission to add roles to the server role shop.");
                    let price = Number(data.args[2]);
                    if(isNaN(price)) return data.message.channel.send("Invalid price amount. Type `%help roleshop` for more info with examples.");

                    tools.addRoleToShop(data, role, price);
                case "remove":
                    if (!tools.isAllowed(data.message, "MANAGE_ROLES")) return data.message.channel.send(":x: You need the manage roles permission to remove roles from the server role shop.");
            }
        }
        
    }
}