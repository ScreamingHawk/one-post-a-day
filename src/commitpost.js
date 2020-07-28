const git = require('simple-git')()
const { indexPath } = require('./writepost')

module.exports.commitEntry = async entry => {
	console.debug("Pushing it up")
	await git.add('./posts/*')
	await git.add(indexPath())
	await git.commit(`${entry.updated ? 'Updated' : 'Added'} ${entry.createdDate}`)
	//await git.push()
}
