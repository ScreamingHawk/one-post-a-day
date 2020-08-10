const test = require('ava')
const moment = require('moment-timezone')
const unit = require('./discord')

test.before.cb(t => {
	unit.init(t.end)
})

// All these tests are skipped for CI purposes as they rely on discord auth tokens not stored in the repo

test.skip('list of messages', async t => {
	const results = await unit.getEntry(new Date("2020-07-28"))
	t.is(moment(results[0].created).format("YYYY-MM-DD"), '2020-07-28')
})

test.skip('find missing post', async t => {
	// Find the entry on the 29th
	const results = await unit.getEntry(new Date("2020-07-29"))
	// There isn't one, returns the 28th
	t.is(moment(results[0].created).format("YYYY-MM-DD"), '2020-07-28')
})

test.skip('find closer today', async t => {
	const results = await unit.getEntry(new Date("2020-07-30"))
	t.is(moment(results[0].created).format("YYYY-MM-DD"), '2020-07-30')
})
