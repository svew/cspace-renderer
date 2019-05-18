
function setPolygonBrush(context, strokeColor, fillColor) {
	if(strokeColor != null) {
		context.strokeStyle = strokeColor
	} else {
		context.strokeStyle = 'rgb(255, 51, 0)'
	}
	if(fillColor != null) {
		context.fillStyle = fillColor
	} else {
		context.fillStyle = 'rgb(255, 150, 100)'
	}
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Triangle = function(p0, p1, p2) {
	this.p0 = p0
	this.p1 = p1
	this.p2 = p2
	this.type = CONVEX_TRIANGLE
}

Triangle.prototype.draw = function(context, next) {
	if(this.p0 == null) {
		throw Error('Triangle must be defined with at least p0') 
	}
	
	setPolygonBrush(context)

	let p1 = this.p1
	if(p1 == null) {
		if(next == null) {
			return
		} else {
			p1 = next
		}
	}

	context.beginPath()
	context.moveTo(this.p0.x, this.p0.y)
	context.lineTo(p1.x, p1.y)

	let p2 = this.p2
	if(p2 == null) {
		if(next == null) {
			context.stroke()
			return
		} else {
			p2 = next
		}
	}
	context.lineTo(p2.x, p2.y)
	context.lineTo(this.p0.x, this.p0.y)
	context.fill()
	context.stroke()
}

Triangle.prototype.getVertices = function() {
	if(!this.complete()) {
		throw Error('Triangle is not complete')
	}
	r = this.p1.subtract(this.p0)
	t = this.p2.subtract(this.p0)
	if(r.cross(t) < 0) {
		return [this.p0, this.p2, this.p1]
	} else {
		return [this.p0, this.p1, this.p2]
	}
}

Triangle.prototype.complete = function() {
	return this.p0 != null && this.p1 != null && this.p2 != null
}

Triangle.prototype.addVertex = function(v) {
	if(this.p0 == null) {
		this.p0 = v
		return
	}
	if(this.p1 == null) {
		this.p1 = v
		return
	}
	if(this.p2 == null) {
		this.p2 = v
		return
	}
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Rectangle = function(p0, p1) {
	this.p0 = p0
	this.p1 = p1
}

Rectangle.prototype.draw = function(context, next) {
	if(this.p0 == null) {
		throw Error('Rectangle must have at least 1 point')
	}

	setPolygonBrush(context)

	let p1 = this.p1
	if(p1 == null) {
		if(next == null) {
			return
		} else {
			p1 = next
		}
	}
	l = Math.min(this.p0.x, p1.x)
	t = Math.min(this.p0.y, p1.y)
	r =	Math.max(this.p0.x, p1.x)
	b = Math.max(this.p0.y, p1.y)
	context.fillRect(l, t, r - l, b - t)
	context.strokeRect(l, t, r - l, b - t)
}

Rectangle.prototype.getVertices = function() {
	if(!this.complete()) {
		throw Error('Rectangle is incomplete')
	}
	l = Math.min(this.p0.x, this.p1.x)
	t = Math.min(this.p0.y, this.p1.y)
	r =	Math.max(this.p0.x, this.p1.x)
	b = Math.max(this.p0.y, this.p1.y)
	return [
		new Vector2(l, t),
		new Vector2(r, t),
		new Vector2(r, b),
		new Vector2(l, b)
	]
}

Rectangle.prototype.complete = function() {
	return this.p0 != null && this.p1 != null
}

Rectangle.prototype.addVertex = function(v) {
	if(this.p0 == null) {
		this.p0 = v
		return
	}
	if(this.p1 == null) {
		this.p1 = v
		return
	}
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Line = function(p0, p1) {
	this.p0 = p0
	this.p1 = p1
}

Line.prototype.draw = function(context, next, strokeColor, fillColor) {
	if(this.p0 == null) {
		throw Error('Line must have at least 1 point')
	}

	setPolygonBrush(context, strokeColor, fillColor)

	let p1 = this.p1
	if(p1 == null) {
		if(next == null) {
			return
		} else {
			p1 = next
		}
	}
	context.beginPath()
	context.moveTo(this.p0.x, this.p0.y)
	context.lineTo(p1.x, p1.y)
	context.stroke()
}

Line.prototype.getVertices = function() {
	if(!this.complete()) {
		throw Error('Line is incomplete')
	}
	return [ this.p0, this.p1 ]
}

Line.prototype.complete = function() {
	return this.p0 != null && this.p1 != null
}

Line.prototype.addVertex = function(v) {
	if(this.p0 == null) {
		this.p0 = v
		return
	}
	if(this.p1 == null) {
		this.p1 = v
		return
	}
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Convex = function(vertices) {
	if(vertices.length < 2) {
		throw Error('Cannot have convex polygon with less than 2 vertices')
	}
	this.vertices = vertices
	this.n = vertices.length
}

Convex.prototype.draw = function(context) {

	setPolygonBrush(context)
	context.beginPath()
	context.moveTo(this.vertices[0].x, this.vertices[0].y)
	for(i = 0; i <= this.vertices.length; i+=1) {
		v = this.vertices[i % this.vertices.length]
		context.lineTo(v.x, v.y)
	}
	context.fill()
	context.stroke()
}

Convex.prototype.getVertices = function() {
	return this.vertices
}

Convex.prototype.collidesLine = function(p0, p1) {
	nullcheck(p0, 'p0')
	nullcheck(p1, 'p1')

	if(this.collidesVertex(p0) || this.collidesVertex(p1)) {
		return true
	}
	for(let i = 0; i < this.n; i+=1) {
		let p2 = this.vertices[i]
		let p3 = this.vertices[(i+1) % this.n]
		if(collidesLineLine(p0, p1, p2, p3)) {
			return true
		}
	}
	return false
}

Convex.prototype.collidesVertex = function(v) {
	nullcheck(v, 'v')

	for(let i = 0; i < this.n; i+=1) {
		let p0 = this.vertices[i]
		let p1 = this.vertices[(i+1) % this.n]
		
		let v0 = p1.subtract(p0)
		let v1 = v.subtract(p0)
		if(v0.cross(v1) < 0) {
			return false
		}
	}
	return true
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function collidesLineLine(s0, e0, s1, e1) {
	ax = e0.x - s0.x
	ay = e0.y - s0.y
	bx = s1.x - e1.x
	by = s1.y - e1.y
	dx = s1.x - s0.x
	dy = s1.y - s0.y
	det = ax*by - ay*bx
	if(det == 0) {
		return false
	}
	r = (dx*by - dy*bx) / det
	s = (ax*dy - ay*dx) / det

	return !(r < 0 || r > 1 || s < 0 || s > 1)
}

// To get rid of tiny rounding errors which change vertex order, but are too small
// to change their angle when doing angle calculations
function vectorSetRound(s) {
	t = []
	for(let i = 0; i < s.length; i+=1) {
		let x = Math.round(s[i].x * 10000000) / 10000000
		let y = Math.round(s[i].y * 10000000) / 10000000
		t.push(new Vector2(x, y))
	}
	return t
}

// Used by the minkowski sum to find the lowest vertex in the convex shape.
function findLowestVertex(s) {
	for(let b = 0; b < s.length; b+=1) {
		let a = modulus(b-1, s.length)
		let c = modulus(b+1, s.length)
		if(s[a].y > s[b].y || (s[a].y == s[b].y && s[a].x > s[b].x)) {
			if(s[c].y > s[b].y || (s[c].y == s[b].y && s[c].x > s[b].x)) {
				return b
			}
		}
	}
	console.log(s)
	throw Error('Couldnt find a lowest point in the convex set')
}

// Used by the minkowski sum:
//   1. Finds the lowest vertex in the list
//   2. Clones the list starting at the lowest vertex, wrapping around if needed
//   3. Appending the first two elements in the new list to the end
function polygonCopyExpand(s) {
	let t = []
	let lowest = findLowestVertex(s)
	for(let i = 0; i < s.length; i+=1) {
		let ij = (i + lowest) % s.length
		t.push(s[ij])
	}
	t.push(t[0])
	t.push(t[1])
	return t
}

// Performs a minkowski sum of the two given vertex sets, and returns the sum
function minkowski(s0, s1) {

	let n = s0.length
	let m = s1.length
	s0 = vectorSetRound(s0)
	s1 = vectorSetRound(s1)
	s0 = polygonCopyExpand(s0)
	s1 = polygonCopyExpand(s1)

	let t = []
	let i = 0
	let j = 0

	do {

		t.push( s0[i].add(s1[j]) )

		let v = s0[i+1].subtract(s0[i])
		let w = s1[j+1].subtract(s1[j])
		let vt = Math.atan2(v.y, v.x)
		let wt = Math.atan2(w.y, w.x)
		if(vt < 0 || i >= n) { //Fix the issue with not wrapping the last angles around x-axis
			vt += Math.PI*2
		}
		if(wt < 0 || j >= m) {
			wt += Math.PI*2
		}

		if(vt < wt) {
			i += 1
			continue
		}
		if(vt > wt) {
			j += 1
			continue
		}
		if(vt == wt) {
			i += 1
			t.push( s0[i].add(s1[j]) ) //Redundant, but necessary for graphics
			j += 1
		}

	} while(!(i == n && j == m))

	return t
}

// Creates a new mesh from two similar convex regions
function makeMeshGeometry(s0, s1, z0, z1) {
	let geom = new THREE.Geometry()

	// Find the vertex in s1 that's closest to s0[0] so we can start making triangles
	// at that point
	let j = 0
	let dist = Infinity
	for(let i = 0; i < s1.length; i+=1) {
		let v = s1[i].subtract(s0[0])
		let dot = v.dot(v)
		if(dot < dist) {
			dist = dot
			j = i
		}
	}

	// Create vertices for s0
	for(let i = 0; i < s0.length; i+=1) {
		geom.vertices.push(new THREE.Vector3(s0[i].x, z0, s0[i].y))
	}

	// Create vertices for s1
	for(let i = 0; i < s1.length; i+=1) {
		let ij = (i+j) % s1.length
		geom.vertices.push(new THREE.Vector3(s1[ij].x, z1, s1[ij].y))
	}

	// Create faces for triangles with the base on s0
	for(let i = 0; i < s0.length; i+=1) {
		let v0 = i
		let v1 = (i+1) % s0.length
		let v2 = i + s0.length
		geom.faces.push(new THREE.Face3( v2, v1, v0 ))
	}

	// Create faces for triangles with the base on s1
	for(let i = 0; i < s1.length; i+=1) {
		let v0 = i + s0.length
		let v1 = (i+1) % s1.length + s0.length
		let v2 = (i+1) % s0.length
		geom.faces.push(new THREE.Face3( v0, v1, v2 ))
	}

	geom.computeFaceNormals()

	return geom
}

// Creates a 2D geometry about that convex shape
function makeConvexFaceGeometry(s, z) {
	let geom = new THREE.Geometry()

	// Create vertices
	for(let i = 0; i < s.length; i+=1) {
		geom.vertices.push(new THREE.Vector3(s[i].x, z, s[i].y))
	}

	// Create triangles
	for(let i = 1; i < s.length; i+=1) {
		let v0 = 0
		let v1 = i
		let v2 = (i+1) % s.length
		geom.faces.push(new THREE.Face3( v0, v1, v2 ))
		geom.faces.push(new THREE.Face3( v2, v1, v0 ))
	}

	geom.computeFaceNormals()

	return geom
}