
var RRT_FREQ_GOAL_CHECKS = 100
var RRT_DRAW_CALLS = 100

var RRT = function(cspace, start) {
	this.cspace = cspace
	this.start = start
	this.nodes = []
	
	this.nodes.push(new RRTNode(this.start))
	console.log('Nodes: ')
	console.log(this.nodes)
}

RRT.prototype.run = function(jobHandler) {
	var myRRT = this
	setTimeout(function(){myRRT._run(jobHandler)}, 0)
}

RRT.prototype._run = function(jobHandler) {
	console.log('Starting RRT run')
	let i = 1
	while(true) {
		if(jobHandler != null && jobHandler.terminate == true) {
			console.log('RRT run terminated')
			break
		}
		if(i % RRT_DRAW_CALLS == 0) {
			onDraw()
		}
		if(i % RRT_FREQ_GOAL_CHECKS == 0) {
			let goal = this.cspace.getGoalVertex()
			if(this.appendNewNode(goal)) {

				let last = this.nodes[this.nodes.length - 1] // The last node added
				while(last != null) {
					last.highlight = true
					last = last.parent
				}
				console.log('Found solution using ' + this.nodes.length + ' nodes')
				console.log('Searched through ' + i + ' possible nodes')
				break
			}
		} else {
			let nextVertex = this.cspace.getRandomVertex()
			this.appendNewNode(nextVertex)
		}
		i += 1
	}
	jobHandler.finished = true
	jobHandler.callback()
	onDraw()
}

RRT.prototype.appendNewNode = function(v) {
	let result = this.findClosestSegment(v)
	if(this.cspace.collidesLine(result.nearest, v)) {
		return false // This new point collided with some obstacle in the region
	} else {
		if(result.n1 == null) {
			if(result.intermediate == null) {
				let newNode = new RRTNode(v)
				newNode.parent = result.n0
				this.nodes.push(newNode)
			} else {
				let newNode1 = new RRTNode(v)
				let newNode2 = new RRTNode(intermediate)
				newNode1.parent = newNode2
				newNode2.parent = result.n0
				this.nodes.push(newNode1)
				this.nodes.push(newNode2)
			}
		} else {
			if(result.intermediate == null) {
				let newNode1 = new RRTNode(v)
				let newNode2 = new RRTNode(result.nearest)
				newNode2.parent = result.n1
				newNode1.parent = newNode2
				result.n0.parent = newNode2
				this.nodes.push(newNode2)
				this.nodes.push(newNode1)
			} else {
				let newNode1 = new RRTNode(v)
				let newNode2 = new RRTNode(result.intermediate)
				let newNode3 = new RRTNode(result.nearest)
				newNode1.parent = newNode2
				newNode2.parent = newNode3
				newNode3.parent = result.n1
				result.n0.parent = newNode3
			}
		}
		return true
	}
}

RRT.prototype.findClosestSegment = function(v) {
	let p0 = null
	let p1 = null
	let nearest = null
	let intermediate = null
	let distance = Infinity
	for(let i = 0; i < this.nodes.length; i+=1) {
		let n0 = this.nodes[i]
		let n1 = n0.parent
		if(n1 == null) {
			let d = v.subtract(n0.position).len()
			if(d < distance) {
				distance = d
				nearest = n0.position
				p0 = n0
				p1 = null
			}
		} else {
			let result = findPointToLine(n0.position, n1.position, v)
			if(result.distance < distance) {
				distance = result.distance
				nearest = result.nearestPoint
				intermediate = result.intermediate
				if(nearest.equals(n0.position)) {
					p0 = n0
					p1 = null
				} else if(nearest.equals(n1.position)) {
					p0 = n1
					p1 = null
				} else {
					p0 = n0
					p1 = n1
				}
			}
		}
	}
	return {
		'n0': p0,
		'n1': p1,
		'nearest': nearest,
		'intermediate': intermediate,
		'distance': distance
	}
}

RRT.prototype.draw2D = function(context) {
	for(let i = 0; i < this.nodes.length; i+=1) {
		let node = this.nodes[i]
		if(node.parent == null) {
			continue
		}
		let p0 = node.position.asVector2()
		let p1 = node.parent.position.asVector2()
		let color = 'rgb(10, 10, 10)'
		if(node.highlight) {
			color = 'rgb(100, 100, 255)'
		}
		new Line(p0, p1).draw(context, null, color, color)
	}
}

RRT.prototype.draw3D = function(scene) {
	let geometry = new THREE.BufferGeometry()
	let vertices = []
	for(let i = 0; i < this.nodes.length; i+=1) {
		let node = this.nodes[i]
		if(node.parent != null) {
			let pos = node.position
			let sy = this.cspace.delta_level
			vertices.push(pos.x, pos.y * sy, pos.z)
			pos = node.parent.position
			vertices.push(pos.x, pos.y * sy, pos.z)
		}
	}
	geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
	let material = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 1 })
	let line = new THREE.LineSegments( geometry, material )
	scene.add(line)
}


