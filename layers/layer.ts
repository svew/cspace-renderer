
// Layers are collections of geometry which are created using some algorithm on
// a space. Some layers must be created using a space, others may need to use
// other layers.
abstract class Layer {

	run() {
		while(!this.finished()) {
			this.step()
		}
	}
	abstract step(): void
	abstract finished(): boolean
	abstract draw(context: CanvasRenderingContext2D): void
}