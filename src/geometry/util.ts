
function closestPointOnLine(line: Line, point: Vector) {
	let l0 = line.vertices[0]
	let l1 = line.vertices[1]
	let v0 = l1.subtract(l0)
	let v1 = point.subtract(l0)
	let len = v0.length()
	if(len == 0 && l0.equals(l1)) {
		return { 'distance': 0, 'nearestPoint': l0 }
	}
	let t = v0.normalize().dot(v1.multiply(1.0/len))
	if(t < 0.0) {
		t = 0.0
	}
	if(t > 1.0) {
		t = 1.0
	}
	let nearest = v0.multiply(t)
	let dist = nearest.subtract(v1).len()
	nearest = nearest.add(start)
	return { 'distance': dist, 'nearestPoint': nearest }
}

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