const path = require("path");
const mainPath = path.resolve(__dirname + "/../../");
const info = require(mainPath + "/database/info.json");

module.exports = {
    start(data){
        let file = data.args[0];

        if(!file) return data.message.channel.send("Please specify a command to reload.");

        try {
            if (file in info.regularCommands) {
                delete require.cache[require.resolve(mainPath + "/" + info.regularCommands[file].path)];
                return data.message.channel.send(`:white_check_mark: Successfully reloaded command: **${file}**`);
            }
            else if(file in info.staffCommands) {
                delete require.cache[require.resolve(mainPath + "/" + info.staffCommands[file][0])];
                return data.message.channel.send(`:white_check_mark: Successfully reloaded command: **${file}**`);
            }
            else return data.message.channel.send(`I can't seem to be able to find the command **${file}**. :cry: .`);
        } catch (error) {
            console.warn(error);
            return data.message.channel.send(`I can't seem to be able to find the command **${file}**. :cry: .`);
        }
    }
};
