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
	getEntry: async () => {
		console.debug('Searching for posts')
		// Search for posts in the past 24 hours.
		const channel = discord.channels.cache.get(channelId)
		// Filter it for first (latest) result from user
		await channel.messages.fetch()
		const message = channel.messages.cache.filter(m => m.author.id == userId).first()
		// Confirm date
		const yesterdayLimit = new Date().getTime() - (24 * 60 * 60 * 1000)
		if (message.createdTimestamp < yesterdayLimit){
			// It's NOT today
			console.warn('No message posted today')
			return null
		}
		// Return it
		return {
			created: message.createdTimestamp,
			content: message.content,
		}
	},
}
