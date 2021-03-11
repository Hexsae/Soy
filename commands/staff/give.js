module.exports = {
    async start(data){
        if(data.args.length < 2){
            return data.message.channel.send("Please specify the user and amount of beans!");
        }
        let amount = Number(data.args[1]);
        if (isNaN(amount)) return data.message.channel.send("Invalid amount");

        let userid = data.args[0].replace(/[<!@>]/g, '');
        let user = await data.soy.users.fetch(userid);

        if(!user) return data.message.channel.send("Invalid user.");

        data.db.run("INSERT OR IGNORE INTO userdata (discordid, name, beans) VALUES (?, ?, 0)", [user.id, user.tag])

        data.db.run("UPDATE userdata SET beans = beans + ? WHERE discordid = ?", [amount, user.id]);

        return data.message.channel.send(`${data.message.author.toString()} has generously given **${user.tag}** ${amount} beans!`)
    }
}