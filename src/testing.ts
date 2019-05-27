
const util = require('./util.js')
const Vector3 = require('./vector3.js')

console.log('Testing Bresenhams Algorithm with Y as driving axis')

//testBresenhams(new Vector3(0, 0, 0), new Vector3(0, 5, 0), 6)
//testBresenhams(new Vector3(0, 0, 0), new Vector3(0, 5.5, 0), 6)
//testBresenhams(new Vector3(0, -0.5, 0), new Vector3(0, 5, 0), 6)
//testBresenhams(new Vector3(0, 0.2, 0), new Vector3(0, 0.7, 0), 0)
//testBresenhams(new Vector3(0, 0.2, 0), new Vector3(0, 1.7, 0), 1)

testBresenhams(new Vector3(-2, 2, 3), new Vector3(-20, 6, 12), 0)

function testBresenhams(start, end, expected) {
	console.log('Start: ' + start + ', End: ' + end)
	let out = util.bresenhams(start, end)
	console.log('Expected: ' + expected)
	console.log('Actual:   ' + out.length)
	console.log('')
	console.log(out)
	console.log('')
	console.log('')
}