const test = require('ava')
const unit = require('./file')

test('gets earliest date', t => {
	t.is(unit.getEarliestMissingDate().format("YYYY-MM-DD"), '2020-07-29')
})
