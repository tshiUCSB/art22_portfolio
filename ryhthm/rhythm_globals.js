
// class Particle {
// 	constructor(particleX, particleY, noiseX, noiseY, variationX, 
// 		variationY, strokeVal, radius) {
// 		this.px = particleX;
// 		this.py = particleY;
// 		this.nx = noiseX;
// 		this.ny = noiseY;
// 		this.vx = variationX;
// 		this.vy = variationY;
// 		this.strk = strokeVal;
// 		this.pntRadius = radius;
// 		this.r = 0;
// 		this.connect = false;
// 	}

// 	calculatePos() {
// 		this.vx += this.nx;
// 		this.vy += this.ny;
// 		this.px = noise(this.vx) * w;
// 		this.py = noise(this.vy) * h;
// 	}

// 	draw() {
// 		fill(this.strk);
// 		stroke(this.strk);
// 		this.calculatePos();
// 		ellipse(this.px, this.py, this.pntRadius, this.pntRadius);
// 	}

// 	connect(particle) {
// 			stroke(this.strk);
// 			line(this.px, this.py, particle.px, particle.py);
// 	}
// }