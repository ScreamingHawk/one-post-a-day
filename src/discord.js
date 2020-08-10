const discordjs = require('discord.js')
const discord = new discordjs.Client()

const moment = require('moment-timezone')
require('dotenv').config()

const token = process.env.DISCORD_TOKEN
const channelId = process.env.DISCORD_CHANNEL
const userId = process.env.DISCORD_USER

if (!token || !channelId || !userId){
	for (let i = 5; i-- > 0;){
		console.error('MISSING CONFIG!!!')
	}
	process.exit(1)
}

module.exports = {
	init: callback => {
		console.debug('Logging in to discord')
		discord.once('ready', callback)
		discord.login(token)
	},
	getEntry: async until => {
		// Search for posts until the given date
		console.debug('Searching for posts')
		if (!until){
			// Default to yesterday
			until = new Date().valueOf() - (24 * 60 * 60 * 1000)
		} else {
			until = until.valueOf()
		}
		const channel = discord.channels.cache.get(channelId)
		await channel.messages.fetch({ limit: 1 })
		// Loop until we have all the messages we need
		while (channel.messages.cache.last().createdTimestamp > until){
			await channel.messages.fetch({ limit: 1, before: channel.messages.cache.last().id })
		}
		// Strip messages to import parts
		return channel.messages.cache.filter(m => m.author.id == userId).map(m =>
			({
				created: m.createdTimestamp,
				content: m.content,
			})
			).reverse()
	},
}
