const fs = require('fs')
const path = require('path');

module.exports.filePath = entry => path.join(__dirname, '../posts', `${entry.createdDate}.json`)
module.exports.indexPath = () => path.join(__dirname, '../index.html')

module.exports.writeEntry = entry => {
	// Write JSON
	const fname = module.exports.filePath(entry)
	fs.writeFileSync(fname, JSON.stringify(entry))

	// Write to index.html
	const indexPath = module.exports.indexPath()
	let index = fs.readFileSync(indexPath, {encoding:'utf8', flag:'r'})
	if (!index.match(new RegExp(`/${entry.createdDate}/`))){
		// New entry
		index += `\t\t\t<section><h2>${entry.content}</h2><span>${entry.createdDate} ${entry.createdTime}</span></section>\r\n`
		fs.writeFileSync(indexPath, index)
	}
}