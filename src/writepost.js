const fs = require('fs')
const path = require('path');

module.exports.filePath = entry => path.join(__dirname, '../posts', `${entry.createdDate}.json`)

module.exports.writeEntry = entry => {
	const fname = module.exports.filePath(entry)
	fs.writeFileSync(fname, JSON.stringify(entry))
}