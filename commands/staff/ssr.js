const fs = require("fs");
const path = require("path");
const mainPath = path.join(__dirname, "../../database");
let owners = ["242346349859700736", "197478173015932928"];

module.exports = {
    start(data){
        let user = data.message.author.id;
        let rank;

        if(data.args.length > 1) {
            user = data.args[0].replace(/[<@!>]/g, '');
            rank = data.args.slice(1).join(" ");
        }
        else{
            rank = data.args[0];
        }

        if(!owners.includes(user)) return data.message.channel.send("User is not allowed to have their rank changed.");

        let dataFile = JSON.parse(fs.readFileSync(mainPath + "/secrethax.json").toString());
        dataFile[user]["server rank"] = rank;

        fs.writeFile(mainPath + "/secrethax.json", JSON.stringify(dataFile), err => {});

        data.message.channel.send(`Successfully changed the server rank for **${dataFile[user].name}**`);
        
    }
}