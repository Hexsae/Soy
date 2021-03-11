const pickuplines = require("../../database/pickuplines.json");
const tools = require("../../tools/functions");

module.exports = {
    start(data){
        let user;

        if(data.args.length > 0)
            user = data.args[0];
        else user = data.message.author.toString();

        if (user.toLowerCase() === "soy" || user.includes("268479232731119617")){
            return data.message.channel.send("Huhu, unlike your hopeless self, I do not require your love :skull:.")
        }

        let message = pickuplines[tools.soyRandom(0, pickuplines.length)];
        message = message.replace("<user>", user);
        return data.message.channel.send(message);
    }
}
