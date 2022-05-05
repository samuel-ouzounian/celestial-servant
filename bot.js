const { Client, Intents } = require('discord.js');
const dotenv = require('dotenv');
require('dotenv').config();
const ethers = require('ethers');
const mintAbi = require("./mintContract.json");
const discordAbi = require("./discordLink.json");


const network = {
  name: "Mumbai Testnet",  // replace this with the network your contract is on
  chainId: 80001,     // replace this with the ChainID your contract is on
  _defaultProvider: (providers) => new providers.JsonRpcProvider(process.env.ALCHEMY_URL)
};


const mintContractAddress = '0x8F14cFecc6B51100F1D482FADE23442DEc414Dec';
const discordLinkAddress = '0x51e600fD56F42b32b2F38902C0bab7B59A286931';
const guildID = '970843569948610630';
const whiteChannelID = '970843570556772453';
const bronzeChannelID = '970843570556772454';
const goldChannelID = '970843570556772455';
const platinumChannelID = '970843570556772456';
const whiteRoleID = '970843569948610637';
const bronzeRoleID = '970843569948610634';
const goldRoleID = '970843569948610635';
const platinumRoleID = '970843569948610636';

const provider = ethers.getDefaultProvider(network);

const mintContract = new ethers.Contract(mintContractAddress, mintAbi, provider);

const discordLink = new ethers.Contract(discordLinkAddress, discordAbi, provider);





// Load environment variables
dotenv.config();

// Create a bot instance
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


// Log our bot in
bot.login(process.env.DISCORD_BOT_TOKEN);

bot.on('ready', () => {
  console.log(`${bot.user.username} is up and running!`);
});

mintContract.on('tierChange', async (address) => {
  const guild = bot.guilds.cache.get(guildID);
  const whiteID = whiteChannelID;
  const bronzeID = bronzeChannelID;
  const goldID = goldChannelID;
  const platinumID = platinumChannelID;
  var whitelist = await mintContract.whiteListLength.call();
  whitelist = whitelist.toString()
  var bronzelist = await mintContract.bronzeListLength.call();
  bronzelist = bronzelist.toString()
  var goldlist = await mintContract.goldListLength.call();
  goldlist = goldlist.toString()
  var platinumlist = await mintContract.platinumListLength.call();
  platinumlist = platinumlist.toString()
  const whiteChannel = guild.channels.cache.get(whiteID);
  const bronzeChannel = guild.channels.cache.get(bronzeID);
  const goldChannel = guild.channels.cache.get(goldID);
  const platinumChannel = guild.channels.cache.get(platinumID);

  whiteName = '⚪ White List: ' + whitelist;
  bronzeName = '🟫 Bonze Tier: ' + bronzelist;
  goldName = '🟨 Gold Tier: ' + goldlist;
  platinumName = '⬜ Platinum Tier: ' + platinumlist;

  whiteChannel.setName(whiteName)
    .catch(console.error);
  bronzeChannel
    .setName(bronzeName)
    .then()
    .catch(console.error);
  goldChannel
    .setName(goldName)
    .then()
    .catch(console.error);
  platinumChannel
    .setName(platinumName)
    .then()
    .catch(console.error);



});

mintContract.on('tierChange', async (address) => {
  const guild = bot.guilds.cache.get(guildID);
  var discord = await discordLink.discordID(address)
  var user = await guild.members.fetch(discord)
  var tier = await mintContract.addressTier(address);
  var white = guild.roles.cache.get(whiteRoleID);
  var bronze = guild.roles.cache.get(bronzeRoleID);
  var gold = guild.roles.cache.get(goldRoleID);
  var platinum = guild.roles.cache.get(platinumRoleID);
  tier = tier.toString()
  if (tier == '0') {
    try {
      user.roles.remove(white)
      user.roles.remove(bronze)
      user.roles.remove(gold)
      user.roles.remove(platinum)
    } catch (e) {
      console.log(e)
    }
  }
  if (tier == '1') {
    user.roles.add(white)
  }
  if (tier == '2') {
    user.roles.add(bronze)
    user.roles.remove(white)
  }
  if (tier == '3') {
    user.roles.add(gold)
    user.roles.remove(bronze)
  }
  if (tier == '4') {
    user.roles.add(platinum)
    user.roles.remove(gold)
  }
});

discordLink.on('tierChange', async (address) => {
  const guild = bot.guilds.cache.get(guildID);
  var discord = await discordLink.discordID(address)
  var user = await guild.members.fetch(discord)
  var tier = await mintContract.addressTier(address);
  var white = guild.roles.cache.get(whiteRoleID);
  var bronze = guild.roles.cache.get(bronzeRoleID);
  var gold = guild.roles.cache.get(goldRoleID);
  var platinum = guild.roles.cache.get(platinumRoleID);
  tier = tier.toString()
  if (tier == '0') {
    try {
      user.roles.remove(white)
      user.roles.remove(bronze)
      user.roles.remove(gold)
      user.roles.remove(platinum)
    } catch (e) {
      console.log(e)
    }
  }
  if (tier == '1') {
    user.roles.add(white)
  }
  if (tier == '2') {
    user.roles.add(bronze)
    user.roles.remove(white)
  }
  if (tier == '3') {
    user.roles.add(gold)
    user.roles.remove(bronze)
  }
  if (tier == '4') {
    user.roles.add(platinum)
    user.roles.remove(gold)
  }
});



bot.on('message', async (message) => {
  // Do not reply if message was sent by bot
  if (message.author.bot) return;

  // Reply to !ping
  if (message.content.startsWith('!tier')) {
    const [command, ...args] = message.content.split(' ');
    if (args.length !== 1) {
      return message.reply(
        'You must provide an address!'
      );
    } else {
      try {
        const [address] = args;
        var tier = await mintContract.addressTier(address)
        const response = tier.toString()
        if (response == '0') {
          return message.reply('Not On A Tier');
        }
        if (response == '1') {
          return message.reply('Whitelist');
        }
        if (response == '2') {
          return message.reply('Bronze Tier');
        }
        if (response == '3') {
          return message.reply('Gold Tier');
        }
        if (response == '4') {
          return message.reply('Platinum Tier');
        }
      } catch (e) {
        return message.reply(e)
      }
    }
  }
});

bot.on('message', async (message) => {
  // Do not reply if message was sent by bot
  if (message.author.bot) return;


  if (message.content.startsWith('!join')) {
    try {
    message.reply('Your Discord ID is: ' + message.author.id)
    } catch(e) {
    console.log(e)
    }

  }
});