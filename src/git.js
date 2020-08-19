const git = require('simple-git')()
const { indexPath } = require('./file')

module.exports.commitEntry = async entry => {
	console.debug("Committing entry")
	await git.add('./posts/*')
	await git.add(indexPath())
	await git.commit(`${entry.updated ? 'Updated' : 'Added'} ${entry.createdDate}`)
}

module.exports.push = async () => {
	console.debug("Pushing it up")
	await git.push()
}
