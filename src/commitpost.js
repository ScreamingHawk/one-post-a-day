const git = require('simple-git')()
const { indexPath } = require('./writepost')

module.exports.commitEntry = async entry => {
	await git.add('./posts/*')
	await git.add(indexPath())
	await git.commit(`Add ${entry.createdDate}`)
	await git.push()
}
