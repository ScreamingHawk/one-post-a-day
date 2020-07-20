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

const recordEntry = entry => {
	// Convert timezone to Auckland human friendly
	entry.created = moment.utc(entry.created).tz("Pacific/Auckland")
	entry.createdDate = entry.created.format("YYYY-MM-DD")
	entry.createdTime = entry.created.format("HH:mm")
	//TODO Write to file
	console.debug(JSON.stringify(entry))
	process.exit()
}

discord.once('ready', async () => {
	// Search for posts in the past 24 hours.
	const channel = discord.channels.cache.get(channelId)
	await channel.messages.fetch()
	// Filter it for first (latest) result from user
	const message = channel.messages.cache.filter(m => m.author.id == userId).first()
	// Confirm date
	const yesterdayLimit = new Date().getTime() - (24 * 60 * 60 * 1000)
	if (message.createdTimestamp < yesterdayLimit){
		// It's NOT today
		console.warn('No message posted today')
		process.exit(1)
	}
	// Save it
	recordEntry({
		created: message.createdTimestamp,
		content: message.content,
	})
})

discord.login(token)
