
var CSpace2D = function(workspace) {
	this.workspace = workspace
	this.width = workspace.width
	this.height = workspace.height
	this.obstacles = []
	this.borders = []
	this.robot = null
	this.canvas = null
	this.context = null
	this.setupContext()
}

CSpace2D.prototype.make = function() {

	robot = this.workspace.robot
	this.robot = robot.origin
	let angle = robot.angle

	// First we need to flip the robot
	robot.setAngle(angle + 180)
	let r = robot.getVertices()
	robot.setAngle(angle)

	// Then, the robot's origin must be at (0,0) for the minkowski sum
	for(let i = 0; i < r.length; i+=1) {
		r[i] = r[i].subtract(robot.origin)
	}

	for(let i = 0; i < this.workspace.obstacles.length; i+=1) {
		let o = this.workspace.obstacles[i].getVertices()
		let t = minkowski(r, o)
		this.addObstacle(new Convex(t))
	}

	for(let i = 0; i < this.workspace.borders.length; i+=1) {
		let o = this.workspace.borders[i].getVertices()
		let t = minkowski(r, o)
		this.borders.push(new Convex(t))
		this.borders[i].draw(this.context)
	}
}

CSpace2D.prototype.addObstacle = function(obs) {
	nullcheck(obs, 'obs')
	
	this.obstacles.push(obs)
	obs.draw(this.context)
}

CSpace2D.prototype.draw = function(context) {
	nullcheck(context, 'context')

	context.drawImage(this.canvas, 0, 0)
	if(this.robot != null) {
		this.robot.draw(context)
	}
	if(this.workspace.goal != null) {
		this.workspace.goal.draw(context, 'rgb(255, 25, 50)')
	}
}

CSpace2D.prototype.setupContext = function() {
	this.canvas = document.createElement('canvas')
	this.canvas.width = this.width
	this.canvas.height = this.height
	this.context = this.canvas.getContext('2d')
	this.context.lineWidth = 2
	this.context.lineCap = 'round'
	this.context.lineJoin = 'round'
	drawGrid(this.context, this.canvas.width, this.canvas.height)
}

CSpace2D.prototype.collidesLine = function(p0, p1) {
	nullcheck(p0, 'p0')
	nullcheck(p1, 'p1')

	for(let i = 0; i < this.obstacles.length; i+=1) {
		if(this.obstacles[i].collidesLine(p0, p1)) {
			return true
		}
	}
	for(let i = 0; i < this.borders.length; i+=1) {
		if(this.borders[i].collidesLine(p0, p1)) {
			return true
		}
	}
	return false
}

CSpace2D.prototype.collidesVertex = function(v) {
	nullcheck(v, 'v')

	for(let i = 0; i < this.obstacles.length; i+=1) {
		if(this.obstacles[i].collidesVertex(v)) {
			return true
		}
	}
	for(let i = 0; i < this.borders.length; i+=1) {
		if(this.borders[i].collidesVertex(v)) {
			return true
		}
	}
	return false
}

CSpace2D.prototype.getRandomVertex = function() {
	
	for(let i = 0; i < 100000; i+=1) {
		let x = Math.random() * this.width
		let y = Math.random() * this.height
		let v = new Vector2(x, y)
		if(!this.collidesVertex(v)) {
			return v
		}
	}

	throw Error('Space too crowded, couldnt find any open areas')
}

CSpace2D.prototype.getGoalVertex = function() {
	return this.workspace.goal
}

CSpace2D.prototype.getStartVertex = function() {
	return this.workspace.robot.origin
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var CSpace3D = function(workspace, width, height, scene) {
	this.workspace = workspace
	this.scene = scene
	this.width = width
	this.height = height
	this.subspaces = []
	this.delta_level = null

	// Add a wireframe box where the bounds of the workspace exist
	let geometry = new THREE.EdgesGeometry( new THREE.BoxGeometry( 600, 600, 600 ) )
	geometry.applyMatrix( new THREE.Matrix4().makeTranslation(300, 300, 300) )
	let material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 })
	let wireframe = new THREE.LineSegments( geometry, material )
	this.scene.add( wireframe )

	//Add an axis helper at (0,0,0)
	this.scene.add( new THREE.AxesHelper(100) ) // X: Red, Y: Green, Z: Blue
}

CSpace3D.prototype.make = function(numSpaces) {
	nullcheck(numSpaces, 'numSpaces')

	if(numSpaces < 5) {
		throw Error('Must have at least 8 subspaces')
	}

	// Create each layer of 2D CSpace
	console.log('Creating CSpaces')
	let startAngle = this.workspace.robot.angle
	let delta = 360 / (numSpaces - 1)
	for( let i = 0; i < numSpaces; i+=1 ) {
		this.workspace.robot.setAngle( i*delta )
		let cspace2d = new CSpace2D( this.workspace )
		cspace2d.make()
		this.subspaces.push( cspace2d )
	}
	this.workspace.robot.setAngle(startAngle)

	// For each pair of obstacles in each neighboring CSpace, create a mesh
	console.log('Generating meshes')
	this.delta_level = this.height / (numSpaces - 1)
	for( let i = 1; i < numSpaces; i+=1 ) {
		let c0 = this.subspaces[i-1].obstacles
		let c1 = this.subspaces[i].obstacles
		for( let j = 0; j < c0.length; j+=1 ) {
			let obs0 = c0[j].getVertices()
			let obs1 = c1[j].getVertices()
			let z0 = (i-1) * this.delta_level
			let z1 = i * this.delta_level
			let geom = makeMeshGeometry(obs0, obs1, z0, z1)
			this.scene.add( new THREE.Mesh( geom, new THREE.MeshNormalMaterial() ) )
		}
	}
	//Create top and bottom faces for the shapes
	for( let i = 0; i < this.subspaces[0].obstacles.length; i+=1 ) {
		let obs_bottom = this.subspaces[0].obstacles[i].getVertices()
		let geom = makeConvexFaceGeometry(obs_bottom, 0)
		this.scene.add( new THREE.Mesh( geom, new THREE.MeshNormalMaterial() ) )
		let obs_top = this.subspaces[numSpaces-1].obstacles[i].getVertices()
		geom = makeConvexFaceGeometry(obs_top, this.height)
		this.scene.add( new THREE.Mesh( geom, new THREE.MeshNormalMaterial() ) )
	}
	console.log('Finished generating and adding to scene!')
}

CSpace3D.prototype.getStartVertex = function() {
	console.log(this.workspace)
	let x = this.workspace.robot.origin.x
	let y = this.workspace.robot.angle / this.delta_level
	let z = this.workspace.robot.origin.y
	return new Vector3(x, y, z)
}

CSpace3D.prototype.getRandomVertex = function() {

	for(let i = 0; i < 1000; i++) {
		let y = getRandomInt(this.subspaces.length)
		let x = Math.random() * this.width
		let z = Math.random() * this.height
		let v = new Vector3(x, y, z)
		if(!this.collidesVertex(v)) {
			return v
		}
	}

	throw Error('Space too crowded, couldnt find any open areas')
}

CSpace3D.prototype.collidesVertex = function(v) {
	nullcheck(v, 'v')

	if(Math.ceil(v.y) != v.y) {
		return false
	}
	let space = this.subspaces[v.y]
	return space.collidesVertex(v.asVector2())
}

CSpace3D.prototype.collidesLine = function(p0, p1) {
	nullcheck(p0, 'p0')
	nullcheck(p1, 'p1')

	// The line exists on a single plane
	if(p0.y == p1.y) {
		let space = this.subspaces[p0.y]
		return space.collidesLine(p0.asVector2(), p1.asVector2())

	// The line exists on multiple planes
	} else {
		
		// The lower point is the start
		let start
		let end
		if(p1.y > p0.y) {
			start = p0
			end = p1
		} else {
			start = p1
			end = p0
		}

		let intersections = bresenhams(start, end)
		for(i = 0; i < intersections.length; i++) {
			let p3D = intersections[i]
			let space = this.subspaces[p.y]
			let p2D = new Vector2(p3D.x, p3D.z)
			if(space.collidesVertex(p2D)) {
				return true
			}
		}

		return false
	}
}

CSpace3D.prototype.getGoalVertex = function() {
	let y = getRandomInt(this.subspaces.length)
	let goal = this.workspace.goal
	return new Vector3(goal.x, y, goal.y)
}