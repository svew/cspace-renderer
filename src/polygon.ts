
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