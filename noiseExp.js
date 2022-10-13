
var w = window.innerWidth;
var h = window.innerHeight;
var loopOn;
// var particleX = new Array();
// var particleY = new Array();
// var noiseX = new Array();
// var noiseY = new Array();
var particles = new Array();
var leaders = new Array();

class Particle {
	constructor(particleX, particleY, noiseX, noiseY, variationX, 
		variationY, strokeVal, radius) {
		this.px = particleX;
		this.py = particleY;
		this.nx = noiseX;
		this.ny = noiseY;
		this.vx = variationX;
		this.vy = variationY;
		this.stk = strokeVal;
		this.r = radius;
		this.isLeader = false;
	}

	setStroke(value) {
		this.stk = value;
	}

	calculatePos() {
		this.vx += this.nx;
		this.vy += this.ny;
		this.px = noise(this.vx) * w;
		this.py = noise(this.vy) * h;
	}

	draw(fillVal) {
		fill(fillVal);
		stroke(this.stk);
		this.calculatePos();
		ellipse(this.px, this.py, this.r, this.r);
	}

	connect(particle) {
		var threshold = 40;
		var distance = dist(this.px, this.py, particle.px, particle.py);
		if (distance < threshold) {
			stroke(this.stk);
			line(this.px, this.py, particle.px, particle.py);
			if (!particle.isLeader && this.stk != 0 && particle.stk 
				!= this.stk) {
				particle.setStroke(this.stk);
			}
		}
	}
}

function setup() {
	createCanvas(w, h);
	loopOn = true;
	background(200);
	initParticles(particles, 80);
	chooseLeaders(particles, leaders, 2);
	ellipseMode(RADIUS);
}

function draw() {
	background(200);
	drawParticles(particles, particles.length);
}

function initParticles(arr, total) {
	for (var i = 0; i < total; i++) {
		var p = new Particle(0.0, 0.0, random(.0001, .003), 
		random(.001, .003), random(w), random(h), 0, 1);
		arr.push(p);
	}
}

function chooseLeaders(arr, leadArr, leaderNum) {
	for (var i = 0; i < leaderNum; i++) {
		var lead = floor(random(arr.length - 1));
		for (var j = 0; j < leadArr.length; j++) {
			while(leadArr[j] == lead) {
				lead = floor(random(arr.length - 1));
				console.log(lead);
			}
		}
		leadArr.push(lead);
	}

	console.log(leadArr);

	for (var i = 0; i < leadArr.length; i++) {
		var value = color(random(1, 250), random(1, 250), random(1, 250));
		arr[leadArr[i]].setStroke(value);
		arr[leadArr[i]].isLeader = true;
	}
	// var lead1 = random(arr.length - 1);
	// var lead2 = random(arr.length - 1);
	// while (lead1 == lead2) {
	// 	lead2 = random(arr.length - 1);
	// }
	// arr[lead]
}

// function drawParticle(arr, index) {
// 	fill(0);
// 	stroke(0);
// 	arr[index].calculatePos();
// 	ellipse(arr[index].px, arr[index].py, 3, 3);
// }

// function connectParticle(arr, index) {
// 	var threshold = 50;
// 	var distance = dist(arr[index].px, arr[index].py, 
// 		arr[index - 1].px, arr[index - 1].py);
// 	if (distance < threshold) {
// 		stroke(0);
// 		line(arr[index].px, arr[index].py, 
// 		arr[index - 1].px, arr[index - 1].py)
// 	}
// }

function drawParticles(arr, total) {
	for (var i = 0; i < total; i++) {
		arr[i].draw(arr[i].stk, 0);
		if (i > 0) {
			for (var j = 0; j < total; j++) {
				arr[i].connect(arr[j]   );
			}
		}
	}
}

function mousePressed() {
	if (loopOn) {
		noLoop();
		loopOn = false;
	}
	else if (!loopOn) {
		loop();
		loopOn = true;
	}
}
