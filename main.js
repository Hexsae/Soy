const discord = require("discord.js");
const settings = require("./settings.json");
const info = require("./database/info.json");
const sqlite = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");
const tools = require("./tools/functions.js");
const banlist = require("./database/banlist.json");

//DB connection
const soy = new discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'] });
const db = new sqlite.Database(path.join(__dirname, "database/soybot.db"));

const owners = [];
let guildList;

soy.on("ready", async () => {
    for (let i = 0; i < settings.owners.length; i++){
        let o = await soy.users.fetch(settings.owners[i]);
        owners.push(o);
    }
    guildList = soy.guilds.cache;
    console.log(`${soy.user.username} - ${soy.user.id} online!\nServers: ${guildList.array().length}`);
	db.all("SELECT * FROM userdata;", async (err, rows) => {
        let beanUsers = rows.length;
		soy.user.setPresence({ activity: { name: `%help | ${beanUsers} bean users`, type: 0 } });
    });

    //Update Game status every 5 minutes
     setInterval(() => {
		db.all("SELECT * FROM userdata;", (err, rows) => {
			soy.user.setPresence({ activity: { name: `${settings.normalPrefix}help | ${rows.length} bean users`, type: 0 } });
    })}, 300000);
})

soy.on('error', console.error);

let disabled = [];
let allowThrough = ["misc", "help", "commands", "mod"];

soy.on("message", message => {
    normalPrefix = settings.normalPrefix;
    staffPrefix = settings.staffPrefix;

    if (!message.content.startsWith(normalPrefix) && !message.content.startsWith(staffPrefix)) return;
    if (message.author.bot) return;
    if (message.author.id in banlist){
        return message.channel.send("You are currently banned from using any of my commands. Hmph! Serves you right! -w-");
    }

    console.log(`\nUser: ${message.author.tag}\nServer: ${message.guild.name}\ncommand: ${message}`)

    let parts = message.content.split(" ");
    let filePath;

    let prefixUsed = parts[0][0];
    let command = parts[0].slice(1).toLowerCase();
    let args;

    if (command === "disable" && message.author.id === "242346349859700736") {
        disabled.push(parts.slice(1).join(" "));
        return;
    }
    
    if(!message.guild)
        if (!allowThrough.includes(command)) return;

    else if (command === "enable" && message.author.id === "242346349859700736"){
        disabled.splice(disabled.indexOf(parts.slice(1).join(" ")), 1);
        return;
    }

    args = message.content.split(" ").slice(1).filter(char => {return char !== ""});

    if(!(command in info.regularCommands) && !(command in info.staffCommands)) return;
    if(!(command in info.regularCommands) && prefixUsed !== staffPrefix && message.author.id in info.staffMembers){
        return message.channel.send("Staff commands begin with the staff prefix.");
    }
    else if (!(command in info.regularCommands) && !(message.author.id in info.staffMembers)) return; //They aren't soy boy staff

    if (prefixUsed === staffPrefix) {
        if (!(message.author.id in info.staffMembers) || !(command in info.staffCommands)) return;
        if (info.staffMembers[message.author.id] < info.staffCommands[command][1]) return message.channel.send(
            "Your access level is not high enough to use this command."
        );
        filePath = "./" + info.staffCommands[command][0];
    }else filePath = "./" + info.regularCommands[command].path;

    if(disabled.includes(command)) return;

    exec = require(filePath);
    exec.start({soy: soy, message: message, db: db, args: args});
});


soy.on("guildMemberAdd", async member => {
    try{
        let fd = fs.openSync(path.join(__dirname, `/database/welcomeservers/${member.guild.id}.json`), 'r');
        fs.close(fd, err => {});
    }catch(err){
        return;
    }

    let file = JSON.parse(fs.readFileSync(path.join(__dirname, `/database/welcomeservers/${member.guild.id}.json`)));
    if ("autorole" in file){
        member.edit({roles: [file.autorole]})
            .catch(err =>{
                console.log(err);
                console.log("Did not have permission to autorole in: " + member.guild.name)});
    }
    if(!("message" in file)) return; //if server only has autorole

    let channel = await member.guild.channels.cache.array().filter(ch => {return ch.id === file.channel})[0];

    if(!channel) return; //Maybe deleted channel

    let message = file.message.replace("{user}", member.user.toString());
    message = message.replace("{server}", member.guild.name);

    return channel.send(message);

})

soy.on("guildMemberRemove", async member => {
    try{
        let fd = fs.openSync(path.join(__dirname, `/database/leaveservers/${member.guild.id}.json`), 'r');
        fs.close(fd, err => {});
    }catch(err){
        return;
    }

    let file = JSON.parse(fs.readFileSync(path.join(__dirname, `/database/leaveservers/${member.guild.id}.json`)));

    let channel = await member.guild.channels.cache.array().filter(ch => {return ch.id === file.channel})[0];

    if(!channel) return; //Maybe deleted channel

    let message = file.message.replace("{user}", member.user.username);
    message.replace("{server}", member.guild.name);

    return channel.send(message);

})

soy.on("guildCreate", async guild => {
    try{
        let owner = await guild.members.fetch(guild.ownerID)
        let roles = guild.roles.cache;
        roles = roles.array().map(item => {return item.name});
        roles = roles.filter(ele => {return ele !== '@everyone'}).slice(0, 40).join(" **|** ");

        let embed = new discord.MessageEmbed()
            .setColor(0x00FF00)
            .setTitle("Joined server")
            .setDescription(guild.name + " **|** " + guild.id)
            .addField("Owner", owner.user.tag, true)
            .addField("Members", guild.memberCount, true)
            .addField("Roles", roles, true)
            .setThumbnail(guild.iconURL());

        let guildToMessage = guildList.array().find(g => {return g.id === "265584953616498688"});
        let channel = guildToMessage.channels.cache.array().find(ch => {return ch.id === "292849349812027403"})
        return channel.send({embed});
    }catch(err){
        console.log(err);
        return;
    }
})

soy.on("guildDelete", async guild => {
    try{
        let roles = guild.roles.cache;
        roles = roles.array().map(item => {return item.name});
        roles = roles.filter(ele => {return ele !== '@everyone'}).slice(0, 40).join(" **|** ");

        let embed = new discord.MessageEmbed()
            .setColor(0xFF0000)
            .setTitle("Removed from server")
            .setDescription(guild.name + " **|** " + guild.id)
            .addField("Members", guild.memberCount, true)
            .addField("Roles", roles, true)
            .setThumbnail(guild.iconURL());

        let guildToMessage = guildList.array().find(g => {return g.id === "265584953616498688"});
        let channel = guildToMessage.channels.cache.array().find(ch => {return ch.id === "292849349812027403"})
        return channel.send({embed});
    }catch(err){
        console.log(err);
        return;
    }
})


//Soy responses
soy.on("message", async message => {
    if(message.author.bot) return;
    if(message.content.startsWith(settings.normalPrefix) || message.content.startsWith(settings.staffPrefix)){
        return;
    }
    if (!message.guild){
        if(owners.length === 0) return;
        if (message.author.id in banlist) return;

       let dmChannel = await message.author.createDM();
       dmChannel.send("Type `%help`. To invite me to your server type `%link`");
       let tempowners = [...owners];

       if(tempowners.includes(message.author)) tempowners.splice(tempowners.indexOf(message.author), 1);
       let embed = new discord.MessageEmbed()
            .setColor("PURPLE")
            .setTitle(`DM from ${message.author.tag} [${message.author.id}]`)
            .setDescription(message.content);
        
        for (let i = 0; i < tempowners.length; i++){
            tempowners[i].send({embed});
        }
        return;
    }
    //Discord Bot List server (cuz spam)
    if(message.guild.id === "264445053596991498") return;

    let chat = message.content.toLowerCase();
    let me = soy.user.toString();

    let greet = tools.soyChoice(['Hello :smile: ','Hey! :blush: ']);

    let replies1 = tools.soyChoice(['I have better things to do, human.','Just... No.','*Only knows how to speak in beans* :flushed: ','*Not worth a \
response*','*Halp mi*',"*Doesn't want to be mentioned*","*Busy elsewhere*",'Take my\
 beans and go.','*is still better than you*','k bye.','*This is why Soy prefers\
 beans to humans*','*Stares in spanish*','*Nibbles on a bean instead*','\
*Is too innocent*','Do you have any idea who you\'re talking to?!','*ignores*','\
(╯°□°）╯︵ ┻━┻','Do you have money?','*The Soy demands to be addressed much better!*',"I'm not listening ~(˘▾˘~)\
", "FILTHY HUMAN（╯°□°）╯︵( .o.)"]);

    let replies2 = tools.soyChoice(['Omg!','You\'re a disgrace to the Soy empire!','You.... *gives a cook\
ie-bean*','Bean bean bean?!?!','*faints*','I love you too.','That moment when...\
 *drastically beans to the floor*',"┬─┬ノ( º _ ºノ) I WILL flip this table."]);

    if(message.content.startsWith(me + " prefix")) return message.channel.send("My prefix is `%`");
        
    if (message.mentions.has(soy.user.id) && (chat.includes("love you") || chat.includes("love u") || chat.includes("luv u")) && (message.author.id !== soy.user.id)){
        return message.channel.send(tools.soyChoice(['I love you too', "D'awww", "How kind :o, I get my very own heart!"]))
    }

    if (message.mentions.has(soy.user.id) && (chat.includes('hi ') || chat.includes("hey ") || chat.includes("hello"))){
        return message.channel.send(greet);
    }

    if (message.mentions.has(soy.user.id) && chat.includes("bean")){
        return message.channel.send(replies2);
    }

    if (message.mentions.has(soy.user.id) && (chat.includes("die") || chat.includes("ihy") || chat.includes("kys") || chat.includes("touch me")
        || chat.includes("hate you"))){
        return message.channel.send(tools.soyChoice(['What have I done D:', ';_;', 'How could you :(']))
    }
    
    //Turns out people found this annoying
   /* if (chat.includes("❤")){
        let rand = tools.soyRandom(0, 3);
        //So its 1/3 chance to respond
        if (rand === 1){
            let love = tools.soyChoice(['Awwww','*smells love in the air*... *poofs*','*steals the \
heart and runs* (>°o°)>','Is that a heart I see (¬‿¬)',"Where's my heart :sob:"]);
            
            return message.channel.send(love);
        }
    }*/

    if(message.mentions.has(soy.user.id)){
        return message.channel.send(replies1);
    }
})

soy.login(settings.token);
