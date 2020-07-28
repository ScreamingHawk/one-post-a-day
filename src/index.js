const moment = require('moment-timezone')
const readpost = require('./readpost')
const { writeEntry } = require('./writepost')
const { commitEntry } = require('./commitpost')

module.exports.run = () => {
	console.debug(`Starting logging at ${moment().format()}`)
	try {
		readpost.init(async () => {
			const entry = await readpost.getEntry()
			if (!entry){
				// No result found. Oh well...
				return
			}
			// Convert timezone to Auckland human friendly
			entry.created = moment.utc(entry.created).tz("Pacific/Auckland")
			entry.createdDate = entry.created.format("YYYY-MM-DD")
			entry.createdTime = entry.created.format("HH:mm")

			try {
				// Record the post
				const success = writeEntry(entry)
				if (success){
					await commitEntry(entry)
				}
			} catch (err){
				console.error(err)
				process.exit(1)
			}

			// Done
			console.info('Success :)')
		})

	} catch (err){
		console.error(err)
		process.exit(1)
	}
}

module.exports.cron = () => {
	// Run every 24 hours
	console.info("Running every 24 hours")
	setInterval(module.exports.run, 86400000)
	// Also run it right now
	module.exports.run()
}

module.exports.cron()