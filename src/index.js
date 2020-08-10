const moment = require('moment-timezone')
const { init, getEntry } = require('./discord')
const { writeEntry, getEarliestMissingDate } = require('./file')
const { commitEntry } = require('./git')

const asyncForEach = async (arr, callback) => {
	for (let i = 0; i < arr.length; i++) {
		await callback(arr[i], i, arr)
	}
}

module.exports.run = () => {
	console.debug(`Starting logging at ${moment().format()}`)
	try {
		init(async () => {
			const entries = await getEntry(getEarliestMissingDate())
			if (!entries){
				// No result found. Oh well...
				return
			}
			await asyncForEach(entries, async entry => {
				// Convert timezone to Auckland human friendly
				entry.created = moment.utc(entry.created).tz("Pacific/Auckland")
				entry.createdDate = entry.created.format("YYYY-MM-DD")
				entry.createdTime = entry.created.format("HH:mm")

				// Record the post
				const success = writeEntry(entry)
				if (success){
					await commitEntry(entry)
				}
			})

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