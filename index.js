const Discord = require('discord.js');
const fetch = require('node-fetch');
const Database = require("@replit/database");

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
  if(!encouragements || encouragements.length < 1){
    db.set("encouragements",starterEncouragements);
  }
})

db.get('responding').then(value => {
  if(value === null) {
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
    if(encouragements.length > index) {
      encouragements.splice(index, 1);
    }
    db.set("encouragements", encouragements);
  })
}

const getQuote = () => {
  return fetch("https://zenquotes.io/api/random")
  .then(res => {
    return res.json();
  })
  .then(data => {
    return data[0]['q'] + " - " + data[0]['a']; 
  })
}

client.on('ready',() => {console.log(client.user.tag + " is running...")});

client.on('channelCreate', channel => {
  
})

client.on('message',msg => {
  if(msg.author.bot){
    return
  }

  if(msg.content.startsWith("$purge")){
    purgeTime = parseInt(msg.content.split("$purge ")[1]);
    client.sweepMessages(purgeTime);
    msg.channel.send(`Messages older then ${purgeTime} are removed`);

  }

  if(msg.content === "$stop"){
    db.set('responding', false);
    msg.channel.send("Bot has stopped motivating Niggas");
  }

  if(msg.content === "$start"){
    db.set('responding', true);
    msg.channel.send("Bot has started motivating Niggas");
  }

  if (msg.content === "$inspire"){
    getQuote().then(
      quote => {
        msg.channel.send(quote);
      }
    )
  }

  db.get('responding').then(responding => {
    if(responding && sadWords.some(word => msg.content.includes(word))) {
      db.get("encouragements").then(encouragements => {
        const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
        msg.reply(encouragement);
      })
    }
  })

  
  if(msg.content.startsWith("$new")){
    encouragingMessage = msg.content.split("$new ")[1];
    updateEncouragements(encouragingMessage);
    msg.channel.send("New encouraging message added successfully")
  }

  if(msg.content.startsWith("$delete")){
    index = parseInt(msg.content.split("$delete ")[1]);
    deleteEncouragements(index);
    msg.channel.send("A encouraging message deleted successfully")
  }

  if(msg.content.startsWith("$list")){
    db.get('encouragements').then(encouragements => {
      msg.channel.send(encouragements);
    })
  }

  if(msg.content === "$invitebot"){
    client.generateInvite({
      permissions: ['SEND_MESSAGES', 'MANAGE_GUILD', 'MENTION_EVERYONE'],
    })
  .then(link => msg.channel.send(`The invite link is ${link}`))
  .catch(console.error);
  }

  if(msg.content === "$inviteuser"){
    
  }

  if(msg.content === "$ban"){
    msg.channel.send("Implementing soon");
  }

  if(msg.content === "$kick"){
    msg.channel.send("Implementing soon");
  }

  if(msg.content === "$mute"){
    msg.channel.send("Implementing soon");
  }

})
if(process.env.BOT_TOKEN){
  client.login(process.env.BOT_TOKEN);
}