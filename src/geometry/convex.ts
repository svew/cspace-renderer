
class Convex extends Polygon {

	constructor(vertices: Vector2[]) {
		if(Convex.isConvex(vertices)) {
			super(vertices)
		} else if(Convex.isConvex(vertices.reverse())) {
			super(vertices.reverse())
		} else {
			throw Error("Vertices given must be convex")
		}
	}

	addVertex(): Convex {
		return null
	}

	static isConvex(vertices: Vector2[]): boolean {
		//TODO
	}

	static minkowski(s0: Convex, s1: Convex): Convex {

		let n = s0.vertices.length
		let m = s1.vertices.length
		//s0 = vectorSetRound(s0)
		//s1 = vectorSetRound(s1)
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
	
		return new Convex(t)
	}
}

class Line extends Convex {

	constructor(p0: Vector2, p1: Vector2) {
		super([p0, p1])
	}
}