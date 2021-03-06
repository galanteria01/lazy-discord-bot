const Discord = require('discord.js');
const fetch = require('node-fetch');
const Database = require("@replit/database");
const { MessageEmbed } = require('discord.js');

const {
    getMeme,
    getJoke,
    getCovidStats,
    getCovidTotalStats,
    getQuote
} = require('./modules/api')

const db = new Database();
const client = new Discord.Client();

const sadWords = [
    "sad",
    "depressed",
    "pareshan",
    "angry",
    "unhappy",
    "dukhi"
];

const starterEncouragements = [
    "Cheer up",
    "Hang in there",
    "You are a great person"
];

db.get('encouragements').then(encouragements => {
    if (!encouragements || encouragements.length < 1) {
        db.set("encouragements", starterEncouragements);
    }
})

db.get('responding').then(value => {
    if (value === null) {
        db.set('responding', true);
    }
})

const updateEncouragements = (encouragingMessage) => {
    db.get("encouragements").then(encouragements => {
        encouragements.push([encouragingMessage]);
        db.set("encouragements", encouragements);
    })
}

const deleteEncouragements = (index) => {
    db.get("encouragements").then(encouragements => {
        if (encouragements.length > index) {
            encouragements.splice(index, 1);
        }
        db.set("encouragements", encouragements);
    })
}



client.on('ready', () => { console.log(client.user.tag + " is running...") });

client.on('channelCreate', channel => {

})

client.on('message', msg => {
    if (msg.author.bot) {
        return
    }

    if (msg.content.startsWith("$purge")) {
        purgeTime = parseInt(msg.content.split("$purge ")[1]);
        client.sweepMessages(purgeTime);
        msg.channel.send(`Messages older then ${purgeTime} are removed`);
    }

    if (msg.content === '$info') {
        msg.reply(`\nYour username: ${msg.author.username}\nYour id: ${msg.author.id}`)
    }

    if (msg.content === "$stop") {
        db.set('responding', false);
        msg.channel.send("Bot has stopped motivating Niggas");
    }

    if (msg.content === "$start") {
        db.set('responding', true);
        msg.channel.send("Bot has started motivating Niggas");
    }

    if (msg.content === "$inspire") {
        getQuote().then(
            quote => {
                msg.channel.send(quote);
            }
        )
    }

    db.get('responding').then(responding => {
        if (responding && sadWords.some(word => msg.content.includes(word))) {
            db.get("encouragements").then(encouragements => {
                const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
                msg.reply(encouragement);
            })
        }
    })

    if (msg.content === "$avatar") {
        msg.reply(msg.author.displayAvatarURL({ format: 'png', dynamic: true }));
    }

    if (msg.content.startsWith("$new")) {
        encouragingMessage = msg.content.split("$new ")[1];
        updateEncouragements(encouragingMessage);
        msg.channel.send("New encouraging message added successfully")
    }

    if (msg.content.startsWith("$delete")) {
        index = parseInt(msg.content.split("$delete ")[1]);
        deleteEncouragements(index);
        msg.channel.send("A encouraging message deleted successfully")
    }

    if (msg.content.startsWith("$covid")) {
        country = msg.content.split("$covid ")[1];
        getCovidStats(country).then(data => {
            msg.channel.send(`
        Corona situations in ${data['country']}:
        Cases: ${data['cases']}
        Death: ${data['deaths']}
        Recovered: ${data['recovered']}
        Today Death: ${data['todayDeaths']}
        Today Recovered: ${data['todayRecovered']}
        Active: ${data["active"]}
      `)
        })
    }

    if (msg.content === "$stats") {
        getCovidTotalStats().then(
            data => {
                msg.channel.send(`Covid stats:
        Total: ${data['updated']}
        Death: ${data['deaths']}
        Recovered: ${data['recovered']}
        Active: ${data['active']}
        Death Today: ${data['todayDeath']}
        Recovered Today: ${data['todayRecovered']}
        Critical: ${data['critical']}
        `);
            }
        );
    }

    if (msg.content.startsWith("$joke")) {
        getJoke().then(
            joke => {
                msg.channel.send(`
        Joke of the day
        ${joke['setup']}
        ${joke['punchline']}
        `)
            }
        )
    }

    if (msg.content.startsWith("$meme")) {
        getMeme().then(
            meme => {
                msg.channel.send(meme['title'], { files: meme['preview'] })
            }
        )
    }

    if (msg.content === "$server") {
        msg.channel.send(`Server name: ${msg.guild.name}\nTotal members: ${msg.guild.memberCount}`)
    }

    if (msg.content.startsWith("$list")) {
        db.get('encouragements').then(encouragements => {
            msg.channel.send(encouragements);
        })
    }

    if (msg.content === "$hello") {
        msg.react('????');
    }

    if (msg.content.startsWith("$pin")) {
        msg.channel.pin();
    }

    if (msg.content === "$invitebot") {
        client.generateInvite({
            permissions: ['SEND_MESSAGES', 'MANAGE_GUILD', 'MENTION_EVERYONE'],
        })
            .then(link => msg.channel.send(`The invite link is ${link}`))
            .catch(console.error);
    }

    if (msg.content === "$inviteuser") {
        msg.channel.createInvite({
            maxUses: 2,
            unique: true,
            maxAge: 86400
        }).then(link => {
            msg.reply(`The invite link is https://discord.gg/${link.code}`);
        }).catch((e) => {
            msg.reply("You dont have required permission! ")
        })
    }

    if (msg.content === "$ban ") {
        if (msg.member.hasPermission("BAN_MEMBERS")) {
            if (msg.mentions.members.first()) {
                try {
                    msg.mentions.members.first().ban();
                    msg.reply("I have banned " + msg.mentions.members.first() + '\nRetard go away');
                } catch {
                    msg.reply("I do not have permissions to banned " + msg.mentions.members.first());
                }
            } else {
                msg.reply("You do not have permissions to banned " + msg.mentions.members.first());
            }
        }
    }

    if (msg.content.startsWith("$kick ")) {
        if (msg.member.hasPermission("KICK_MEMBERS")) {
            if (msg.mentions.members.first()) {
                try {
                    msg.mentions.members.first().kick();
                    msg.reply("I have kicked " + msg.mentions.members.first());
                } catch {
                    msg.reply("I do not have permissions to kick " + msg.mentions.members.first());
                }
            } else {
                msg.reply("You do not have permissions to kick " + msg.mentions.members.first());
            }
        }
    }

    if (msg.content === "$mute") {
        msg.channel.send("Implementing soon");
    }

    if (msg.content.startsWith('$embed')) {
        embedMessage = msg.content.split("$embed ")[1];

        const embed = new MessageEmbed()
            .setTitle('Embed')
            .setColor(0xff0000)
            .setDescription(embedMessage);
        msg.channel.send(embed);
    }
})

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
    if (!channel) return;
    channel.send(`Welcome to the server, ${member}`);
});

if (process.env.BOT_TOKEN) {
    client.login(process.env.BOT_TOKEN);
}