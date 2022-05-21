const { Client, Intents } = require('discord.js');
const dotenv = require('dotenv');
require('dotenv').config();
const ethers = require('ethers');
const PreMintAbi = require("./PreMintContract.json");
const discordAbi = require("./discordLink.json");


const network = {
  name: "Polygon Mainnet",  // replace this with the network your contract is on
  chainId: 137,     // replace this with the ChainID your contract is on
  _defaultProvider: (providers) => new providers.JsonRpcProvider(process.env.ALCHEMY_URL)
};


const PreMintContractAddress = '0x5C8d4026944a9bF8753C4c774a46F591fA8E8821';
const discordLinkAddress = '0x15Cb66345a03B5b2Fa1ACA478cDA78BbBFbFc89E';
const guildID = '946228581867073556';
const whiteChannelID = '946257867458084894';
const bronzeChannelID = '964314326003482676';
const goldChannelID = '955849464403341372';
const platinumChannelID = '955850023504068670';
const totalPreMintChannelID = '971905345201000508';
const celestialChannelID = '971165376878637076';
const whiteRoleID = '946245924986949642';
const bronzeRoleID = '968745770696204378';
const goldRoleID = '968746339007610930';
const platinumRoleID = '968746080802078750';
const celestialRoleID = '971177283643666462';

const provider = ethers.getDefaultProvider(network);

const PreMintContract = new ethers.Contract(PreMintContractAddress, PreMintAbi, provider);

const discordLink = new ethers.Contract(discordLinkAddress, discordAbi, provider);





// Load environment variables
dotenv.config();

// Create a bot instance
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


// Log our bot in
bot.login(process.env.DISCORD_BOT_TOKEN);

bot.on('ready', () => {
  updateChannels();
  console.log(`${bot.user.username} is up and running!`);
});

async function updateTier(address) {

  const guild = bot.guilds.cache.get(guildID);
  var discord = await discordLink.discordID(address)
  if (discord.length < 5){
    return;
  }
  var user = await guild.members.fetch(discord)
  var tier = await PreMintContract.addressTier(address);
  var white = guild.roles.cache.get(whiteRoleID);
  var bronze = guild.roles.cache.get(bronzeRoleID);
  var gold = guild.roles.cache.get(goldRoleID);
  var platinum = guild.roles.cache.get(platinumRoleID);
  var celestial = guild.roles.cache.get(celestialRoleID);
  tier = tier.toString()
  if (tier == '0') {
    try {
      user.roles.remove(white)
      user.roles.remove(bronze)
      user.roles.remove(gold)
      user.roles.remove(platinum)
      user.roles.add(celestial)
    } catch (e) {
      console.log(e)
    }
  }
  if (tier == '1') {
    user.roles.add(white)
    user.roles.add(celestial)
  }
  if (tier == '2') {
    user.roles.add(bronze)
    try {
      user.roles.remove(white)
    } catch (e) {
      console.log(e)
    }
    user.roles.add(celestial)
  }
  if (tier == '3') {
    user.roles.add(gold)
    try {
      user.roles.remove(white)
      user.roles.remove(bronze)
    } catch (e) {
      console.log(e)
    }
    user.roles.add(celestial)
  }
  if (tier == '4') {
    user.roles.add(platinum)
    try {
      user.roles.remove(white)
      user.roles.remove(bronze)
      user.roles.remove(gold)
    } catch (e) {
      console.log(e)
    }
    user.roles.add(celestial)
  }

}

async function updateTierGivenDiscordID(_discord) {

  const guild = bot.guilds.cache.get(guildID);
  var address = await discordLink.walletFromDiscord(_discord)
  var discord = await discordLink.discordID(address)
  if (discord.length < 5){
    return;
  }
  var user = await guild.members.fetch(discord)
  var tier = await PreMintContract.addressTier(address);
  var white = guild.roles.cache.get(whiteRoleID);
  var bronze = guild.roles.cache.get(bronzeRoleID);
  var gold = guild.roles.cache.get(goldRoleID);
  var platinum = guild.roles.cache.get(platinumRoleID);
  var celestial = guild.roles.cache.get(celestialRoleID);
  tier = tier.toString()
  if (tier == '0') {
    try {
      user.roles.remove(white)
      user.roles.remove(bronze)
      user.roles.remove(gold)
      user.roles.remove(platinum)
      user.roles.add(celestial)
    } catch (e) {
      console.log(e)
    }
  }
  if (tier == '1') {
    user.roles.add(white)
    user.roles.add(celestial)
  }
  if (tier == '2') {
    user.roles.add(bronze)
    try {
      user.roles.remove(white)
    } catch (e) {
      console.log(e)
    }
    user.roles.add(celestial)
  }
  if (tier == '3') {
    user.roles.add(gold)
    try {
      user.roles.remove(white)
      user.roles.remove(bronze)
    } catch (e) {
      console.log(e)
    }
    user.roles.add(celestial)
  }
  if (tier == '4') {
    user.roles.add(platinum)
    try {
      user.roles.remove(white)
      user.roles.remove(bronze)
      user.roles.remove(gold)
    } catch (e) {
      console.log(e)
    }
    user.roles.add(celestial)
  }

}

async function updateChannels () {
  const guild = bot.guilds.cache.get(guildID);
  var whitelist = await PreMintContract.whiteListLength.call();
  whitelist = whitelist.toString()
  var bronzelist = await PreMintContract.bronzeListLength.call();
  bronzelist = bronzelist.toString()
  var goldlist = await PreMintContract.goldListLength.call();
  goldlist = goldlist.toString()
  var platinumlist = await PreMintContract.platinumListLength.call();
  platinumlist = platinumlist.toString()
  var totalPreMinted = await PreMintContract.totalPreList.call();
  totalPreMinted = totalPreMinted.toString();
  var totalCelestials = Number(platinumlist) + Number(goldlist) + Number(bronzelist) + Number(whitelist);
  totalCelestials = totalCelestials.toString();
  const whiteChannel = guild.channels.cache.get(whiteChannelID);
  const bronzeChannel = guild.channels.cache.get(bronzeChannelID);
  const goldChannel = guild.channels.cache.get(goldChannelID);
  const platinumChannel = guild.channels.cache.get(platinumChannelID);
  const totalPreMintedChannel = guild.channels.cache.get(totalPreMintChannelID);
  const totalCelestialsChannel = guild.channels.cache.get(celestialChannelID);

  whiteName = '⚪ White List: ' + whitelist;
  bronzeName = '🟫 Bonze Tier: ' + bronzelist;
  goldName = '🟨 Gold Tier: ' + goldlist;
  platinumName = '⬜ Platinum Tier: ' + platinumlist;
  totalPreMintedName = '🧮 Pre-Minted: ' + totalPreMinted;
  celestialName = '😇 Celestials: ' + totalCelestials;

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
  totalPreMintedChannel
    .setName(totalPreMintedName)
    .then()
    .catch(console.error);
  totalCelestialsChannel
    .setName(celestialName)
    .then()
    .catch(console.error);


}

PreMintContract.on('tierChange', async (address) => {
  updateTier(address)
  updateChannels()
});

discordLink.on('tierChange', async (address) => {
  updateTier(address)
  updateChannels()
});


bot.on('guildMemberAdd', (member) => {
  updateTierGivenDiscordID(member.guild.id)
  updateChannels()
});

bot.on('guildMemberRemove', (member) => {
  updateChannels()
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
        var tier = await PreMintContract.addressTier(address)
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
    } catch (e) {
      console.log(e)
    }

  }
});
