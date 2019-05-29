
enum Color {
	BLACK,
	ORANGE,
	BLUE
}

abstract class Drawable {
	protected fillStyle: string
	protected strokeStyle: string
	protected color: Color

	constructor(color: Color = Color.BLACK) {
		this.setColor(color)
	}

	setColor(color: Color) {
		switch(color) {
			case Color.ORANGE:
				this.strokeStyle = "rgb(255, 51, 0)"
				this.fillStyle = "rgb(255, 150, 100)"
				break
			case Color.BLUE:
				this.strokeStyle = "rgb(30, 30, 255)"
				this.fillStyle = "rgb(120, 120, 255)"
				break
			case Color.BLACK:
				this.strokeStyle = "rgb(10, 10, 10)"
				this.fillStyle = "rgb(100, 100, 100)"
				break
		}
	}

	draw(context: CanvasRenderingContext2D) {
		context.fillStyle = this.fillStyle
		context.strokeStyle = this.strokeStyle
	}
}