
// A discrete 2D space, populated by grid tiles
class GridSpace extends CanvasSpace {

	private grid: GridTile[][]
	private width: number
	private height: number
	private gridWidth: number
	
	constructor(width: number, height: number, gridWidth: number = 15) {
		if(width % gridWidth != 0 || height % gridWidth != 0) {
			throw Error("Space width/height must be a multiple of "+gridWidth)
		}
		super(width, height, true)
		
		this.width = width / gridWidth
		this.height = height / gridWidth
		this.grid = newGrid2D<GridTile>(this.width, this.height, GridTile.EMPTY)
		this.gridWidth = gridWidth
	}

	get(v: Vector2): GridTile {
		return this.grid[v.x][v.y]
	}

	set()

	draw(context: CanvasRenderingContext2D) {
		context.drawImage(this.canvas, 0, 0)
	}

	gridToPolygons(): Polygon[] {

		let visited = newGrid2D<boolean>(this.width, this.height, false)
		let polygons: Polygon[] = []

		for(let x = 0; x < this.width; x += 1) {
			for(let y = 0; y < this.height; y += 1) {
				if(visited[x][y] == false && this.grid[x][y] == GridTile.FILLED) {
					let vertices: Vector2[] = []
					this.gridToPolygonsRec(new Vector2(x, y), Direction.UP(), visited, vertices)
					polygons.push(new Polygon(vertices))
				}
			}
		}

		return polygons
	}

	private gridToPolygonsRec(curr: Vector2, dir: Direction, visited: boolean[][], vertices: Vector2[]) {
		
		visited[curr.x][curr.y] = true

		for(let i = dir.ccw(); !i.equals(dir); i = i.cw()) {
			let next = i.addTo(curr)

			if(this.outOfBounds(next) || this.get(next) != GridTile.FILLED) {
				let a = new Vector2(CanvasSpace.GRID_WIDTH, CanvasSpace.GRID_WIDTH) // TODO: Replace when Vector class is improved
				vertices.push(i.asOffset().add(curr).multiply(a))
				continue
			}

			if(this.get(next) == GridTile.FILLED && visited[curr.x][curr.y] == false) {
				this.gridToPolygonsRec(next, i, visited, vertices)
			}
		}
	}

	private outOfBounds(v: Vector2): boolean {
		return v.x < 0 || v.y < 0 || v.x >= this.width || v.y >= this.height
	}
}

enum GridTile {
	EMPTY,
	FILLED
}

function newGrid2D<T>(width: number, height: number, value: T): T[][] {
	let grid: T[][] = []
	for(let x = 0; x < width; x += 1) {
		grid[x] = []
		for(let y = 0; y < height; y += 1) {
			grid[x][y] = value
		}
	}
	return grid
}