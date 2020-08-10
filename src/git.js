const git = require('simple-git')()
const { indexPath } = require('./file')

module.exports.commitEntry = async entry => {
	console.debug("Pushing it up")
	await git.add('./posts/*')
	await git.add(indexPath())
	await git.commit(`${entry.updated ? 'Updated' : 'Added'} ${entry.createdDate}`)
}

module.exports.push = async () => {
	await git.push()
}
