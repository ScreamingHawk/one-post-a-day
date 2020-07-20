const moment = require('moment-timezone');
const readpost = require('./readpost')
const writepost = require('./writepost')

module.exports.run = () => {
	try {
		readpost.init(async () => {
			const entry = await readpost.getEntry()
			// Convert timezone to Auckland human friendly
			entry.created = moment.utc(entry.created).tz("Pacific/Auckland")
			entry.createdDate = entry.created.format("YYYY-MM-DD")
			entry.createdTime = entry.created.format("HH:mm")
			// Write to file

			try {
				writepost.writeEntry(entry)
			} catch (err){
				console.error(err)
				process.exit(1)
			}

			// Done
			console.info('Success :)')
			process.exit()
		})

	} catch (err){
		console.error(err)
		process.exit(1)
	}
}

module.exports.run()