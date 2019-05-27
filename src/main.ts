
var wCanvas
var cCanvas
var wContext
var cContext

var workspace
var cspace
var cspaceType

var cspaceRenderer
var cspaceScene
var cspaceControls
var cspaceCamera

var rrt
var rrtJobHandler
var rrtRendered

// Mouse position, and whether or not that mouse should be fixed to a grid
var mouse
var fixedGrid

var drawType
var cursorObject
var cursorType

function main() {

	wCanvas = document.getElementById('workspace')
	cCanvas = document.getElementById('cspace')
	wContext = wCanvas.getContext('2d')
	cContext = null
	
	workspace = new Workspace(wCanvas.width, wCanvas.height)
	cspace = null
	cspaceType = null

	rrt = null
	rrtJobHandler = null
	rrtRendered = false

	cspaceRenderer = null
	cspaceScene = null
	cspaceCamera = null
	cspaceControls = null

	mouse = null
	fixedGrid = true

	drawType = DT_NONE
	cursorObject = null
	cursorType = CT_NONE

	wCanvas.addEventListener('mousemove', onMouseMove, false)
	wCanvas.addEventListener('mousedown', onMouseDown, false)

	onDraw()
}

function onDraw() {
	if(workspace != null) {
		wContext.clearRect(0, 0, 600, 600)
		workspace.draw(wContext)
	}
	if(cspace != null) {
		if(cspaceType == '2D') {
			cContext.clearRect(0, 0, 600, 600)
			cspace.draw(cContext)
		}
	}
	if(rrt != null) {
		rrt.draw2D(wContext)
		if(cspace != null) {
			if(cspaceType == '2D') {
				rrt.draw2D(cContext)
			}
			if(cspaceType == '3D' && rrtJobHandler != null && rrtJobHandler.finished && !rrtRendered) {
				rrtRendered = true
				rrt.draw3D(cspaceScene)
			}
		}
	}
	if(mouse != null) {
		if(cursorObject != null) {
			if(cursorType == CT_ROBOT) {
				if(cursorObject.origin == null) {
					cursorObject.draw(wContext, mouse)
				} else {
					v = mouse.subtract(cursorObject.origin)
					angle = Math.atan2(v.y, v.x)
					console.log(angle)
					cursorObject.setAngle(angle * 180 / Math.PI)
					cursorObject.draw(wContext)
				}
			}
			if(cursorType == CT_OBSTACLE) {
				cursorObject.draw(wContext, mouse)
			}
		}
		if(drawType != DT_NONE) {
			mouse.draw(wContext)
		}
	}
}

function onMouseMove(event) {
	mouse = getMousePos(event)
	onDraw()
}

function onMouseDown(event) {
	if(mouse == null || event == null) {
		return
	}
	if(cursorObject == null) {
		switch(drawType) {
			case DT_RECT:
			case DT_RECT_ROBOT:
				cursorObject = new Rectangle()
				cursorObject.addVertex(mouse)
				cursorType = CT_OBSTACLE
				break
			case DT_TRI:
			case DT_TRI_ROBOT:
				cursorObject = new Triangle()
				cursorObject.addVertex(mouse)
				cursorType = CT_OBSTACLE
				break
			case DT_LINE:
			case DT_LINE_ROBOT:
				cursorObject = new Line()
				cursorObject.addVertex(mouse)
				cursorType = CT_OBSTACLE
				break
			case DT_GOAL:
				workspace.goal = new Vector2(mouse.x, mouse.y)
			case DT_NONE:
				return
		}
	} else {
		switch(drawType) {
			case DT_RECT:
			case DT_TRI:
			case DT_LINE:
				cursorObject.addVertex(mouse)
				if(cursorObject.complete()) {
					workspace.addObstacle(cursorObject)
					cursorObject = null
					cursorType = CT_NONE
				}
				break
			case DT_RECT_ROBOT:
			case DT_TRI_ROBOT:
			case DT_LINE_ROBOT:
				if(cursorType == CT_OBSTACLE) {
					cursorObject.addVertex(mouse)
					if(cursorObject.complete()) {
						v = cursorObject.getVertices()
						cursorObject = new Robot(v, null)
						cursorType = CT_ROBOT
					}
					break
				}
				if(cursorType == CT_ROBOT) {
					if(cursorObject.origin == null) {
						cursorObject.origin = mouse
					} else {
						workspace.addRobot(cursorObject)
						cursorObject = null
						cursorType = CT_NONE
					}
				}
				break;
		}
	}
	onDraw()
}

function getMousePos(event) {
	if(event == null) {
		return null
	}
	let rect = wCanvas.getBoundingClientRect()
	let x = event.clientX - rect.left
	let y = event.clientY - rect.top
	if(fixedGrid) {
		x = Math.round(x / GRID_WIDTH) * GRID_WIDTH
		y = Math.round(y / GRID_WIDTH) * GRID_WIDTH
	}
	return new Vector2(x, y)
}

function onGridOn() {
	fixedGrid = true
}

function onGridOff() {
	fixedGrid = false
}

function onButtonRectangle() {
	drawType = DT_RECT
	cursorObject = null
	onDraw()
}

function onButtonTriangle() {
	drawType = DT_TRI
	cursorObject = null
	onDraw()
}

function onButtonLine() {
	drawType = DT_LINE
	cursorObject = null
	onDraw()
}

function onButtonReset() {
	workspace.reset()
	cspace = null
	cspaceType = null
	rrt = null
	rrtTerminator = null
	onDraw()
}

function onButtonRectRobot() {
	drawType = DT_RECT_ROBOT
	cursorObject = null
	onDraw()
}

function onButtonTriRobot() {
	drawType = DT_TRI_ROBOT
	cursorObject = null
	onDraw()
}

function onButtonLineRobot() {
	drawType = DT_LINE_ROBOT
	cursorObject = null
	onDraw()
}

function onButtonGoal() {
	drawType = DT_GOAL
	cursorObject = null
	onDraw()
}

function onButton2DRender() {
	if(workspace.robot == null) {
		return
	}
	cspace = new CSpace2D(workspace)
	cspace.make()
	cspaceType = '2D'
	cContext = cCanvas.getContext('2d')
	onDraw()
}

function onButton3DRender() {
	if(workspace.robot == null) {
		return
	}

	cspaceRenderer = new THREE.WebGLRenderer( { canvas: cCanvas, antialias: true } )
	cspaceScene = new THREE.Scene()
	cspaceCamera = new THREE.PerspectiveCamera( 70, cCanvas.width/cCanvas.height, 0.01, 200000 )
	cspaceCamera.position.z = 700
	cspaceControls = new THREE.OrbitControls( cspaceCamera )
	cspaceControls.target = new THREE.Vector3( 300, 300, 300 )
	cspaceControls.update()
	cspaceType = '3D'

	cspace = new CSpace3D(workspace, 600, 600, cspaceScene)
	cspace.make(60)

	let animate = function() {
		requestAnimationFrame( animate )
		cspaceControls.update()
		cspaceRenderer.render(cspaceScene, cspaceCamera)
		let i = 0
		cspaceScene.traverse( function(node) {
			if(node instanceof THREE.Mesh) {
				i += 1
			}
		})
	}
	animate()
}

function onButtonRRT() {
	rrt = new RRT(cspace, cspace.getStartVertex())
	rrtJobHandler = { 'terminate':false, 'finished': false, 'callback':function() {
		onDraw()
	}}
	rrtRendered = false
	rrt.run(rrtJobHandler)
}

function onButtonStopRRT() {
	if(rrtJobHandler != null) {
		rrtJobHandler.terminate = true
	}
}

function onButtonTraverse() {

}