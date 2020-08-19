const fs = require('fs')
const path = require('path')
const moment = require('moment')

module.exports.dirPath = () => path.join(__dirname, '../posts')
module.exports.filePath = entry => path.join(module.exports.dirPath(), `${entry.createdDate}.json`)
module.exports.indexPath = () => path.join(__dirname, '../index.html')

module.exports.readEntry = fname => {
	if (fs.existsSync(fname)){
		return JSON.parse(fs.readFileSync(fname))
	}
}

module.exports.getEarliestMissingDate = () => {
	let date = moment()
	if (fs.readdirSync(module.exports.dirPath()).length === 0){
		// Nothing stored. Use today
		return date
	}
	// Check for files until we miss one
	while (!fs.existsSync(module.exports.filePath({createdDate: date.format("YYYY-MM-DD")}))){
		date.subtract(1, "days")
	}
	// We found the earliest stored date. Add a day to get earliest missing
	date.add(1, "days")
	return date
}

const randLimit = limit => ~~(limit * Math.random())

module.exports.writeEntry = entry => {
	// Write JSON
	const fname = module.exports.filePath(entry)
	const prevEntry = module.exports.readEntry(fname)
	if (prevEntry){
		console.debug('Found previous entry at this date')
		// Existing entry for this date
		if (prevEntry.content == entry.content){
			// No change
			console.warn('Ignoring existing entry')
			return false
		}
		entry.update = true
	}
	console.debug('Writing entry to file')
	fs.writeFileSync(fname, JSON.stringify(entry))

	// Write to index.html
	const indexPath = module.exports.indexPath()
	let index = fs.readFileSync(indexPath, {encoding:'utf8', flag:'r'})
	if (entry.update){
		// Existing, remove previous entry
		let split = index.split('\t\t\t')
		split.pop()
		index = split.join('\t\t\t')
	}
	index += `\t\t\t<section class="font${randLimit(3) + 1}" style="background-color: hsla(${randLimit(360)}, 70%, 70%, 0.4)"><h2>${entry.content.replace(/\n/g, "<br/>")}</h2><span>${entry.createdDate} ${entry.createdTime}</span></section>\r\n`
	fs.writeFileSync(indexPath, index)

	return true
}