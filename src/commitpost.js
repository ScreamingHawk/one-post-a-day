const git = require('simple-git')()

module.exports.commitEntry = async entry => {
	await git.add('./posts/*')
	await git.commit(`Add ${entry.createdDate}`)
	await git.push()
}
