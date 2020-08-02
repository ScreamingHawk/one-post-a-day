const fs = require('fs')
const path = require('path');

module.exports.filePath = entry => path.join(__dirname, '../posts', `${entry.createdDate}.json`)
module.exports.indexPath = () => path.join(__dirname, '../index.html')

module.exports.readEntry = fname => {
	if (fs.existsSync(fname)){
		return JSON.parse(fs.readFileSync(fname))
	}
}

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
	index += `\t\t\t<section><h2>${entry.content}</h2><span>${entry.createdDate} ${entry.createdTime}</span></section>\r\n`
	fs.writeFileSync(indexPath, index)

	return true
}