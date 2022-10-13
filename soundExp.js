
var w = window.innerWidth;
var h = window.innerHeight;

var sound, rajdhani;
var isReady = false;
var y, amp;
var fft;
var pntPosX = new Array();
var pntPosY = new Array();
var pntInvPosX = new Array();
var pntInvPosY = new Array();
// var starVal = new Array();
// var starsX = new Array();
// var starsY = new Array();
// var starsA = new Array();
// var starSize = new Array();
// var rippleX = new Array();
// var rippleY = new Array();
// var rippleW = new Array();
// var rippleH = new Array();
// var rippleA = new Array();
var starArr = new Array();
var rippleArr = new Array();

class Star {
	constructor(xCord, yCord, aVal, wVal, hVal, pntNum) {
		this.x = xCord;
		this.y = yCord;
		this.a = aVal;
		this.major = wVal;
		this.minor = hVal;
		this.shapes = pntNum / 2;
	}

	drawStar() {
		for (var i = 0; i < this.shapes; i++) {
			var theta = PI / this.shapes * i;
			var point1 = {
				x: this.x + this.major * cos(theta),
				y: this.y + this.major * sin(theta),
			}
			var point2 = {
				x: this.x + this.minor * cos(theta + PI / 2),
				y: this.y + this.minor * sin(theta + PI / 2),
			}
			var point3 = {
				x: this.x - this.major * cos(theta),
				y: this.y - this.major * sin(theta),
			}
			var point4 = {
				x: this.x - this.minor * cos(theta + PI / 2),
				y: this.y - this.minor * sin(theta + PI / 2),
			}
			quad(point1.x, point1.y, point2.x, point2.y, point3.x,
			 point3.y, point4.x, point4.y);
		}
	}
}

class Ripple {
	constructor(xCord, yCord, aVal, wVal, offsetA, scalar) {
		this.x = xCord;
		this.y = yCord;
		this.a = aVal;
		this.w = wVal;
		this.h = this.w * .2;
		this.offA = offsetA;
		this.offY = this.h * .15;
		this.scalar = scalar;
	}

	drawRipple() {
		stroke(255, 255, 255, this.a);
		ellipse(this.x, this.y, this.w, this.h);
		// var offsetY = rippleH[i] * .15;
		stroke(255, 255, 255, this.a - this.offA);
		ellipse(this.x, this.y + this.offY, this.w * this.scalar, this.h * this.scalar);
		this.w *= this.scalar;
		this.h *= this.scalar;
	}
}

function preload() {
	sound = loadSound("sounds/Follow_Me.m4a");
	rajdhani = loadFont("fonts/rajdhani-light.ttf");
}

function setup() {
	createCanvas(w, h);
	background(0);
	rectMode(RADIUS);
	textFont(rajdhani);
	y = h / 2;
	fft = new p5.FFT();
	amp = .4 * h;
	// starVal = [255, 255, 255, 1];
	// console.log(valueArr);
}

function draw() {
	checkReplay();
	background(0);
	stroke(255, 255, 255, 50);
	line(0, y, width, y);

	if (isReady) {

		var spectrum = fft.analyze();
		for (var i = 0; i < spectrum.length; i++) {
			var x = map(i , 0, spectrum.length * .5, width, 0);
			var xInv = map(i, 0, spectrum.length * .5, 0, width);
			var hSpec = map(spectrum[i], 0, 255, 0, -amp);
			pntPosX[i] = x;
			pntPosY[i] = y + hSpec;
			pntInvPosX[i] = xInv;
			pntInvPosY[i] = y - hSpec;
			// changeValue(spectrum[i]);
			var value = map(spectrum[i], 0, 255, 10, 255);
			fill(value, value, 255, 20);
			stroke(value, value, 255, 100);
			ellipse(x, y + hSpec, 2, 2);
			ellipse(x, y - hSpec, 2, 2);
			// if (frameCount % 40 > 20) {
			// 	console.log(spectrum[i]);
			// }
			connectPnts(i, pntPosX, pntPosY);
			connectPnts(i, pntInvPosX, pntInvPosY);
			checkThreshold("star", x, w - w * .22, w - w * .10, -amp * .7, hSpec);
			checkThreshold("ripple", x, w - w * .10, w - w * .05, -amp * .8, hSpec);
		}

		drawStars(5);
		drawRipples(20);
	}
	else {
		fill(255, 255, 255, 50);
		text("Click", 10, y - 5);
	}
}

function mousePressed() {
	if (!sound.isPlaying()) {
		sound.play();
		isReady = true;
	}
	else if (sound.isPlaying()) {
		sound.pause();
		isReady = false;
	}
}

function checkReplay() {
	if (isReady && !sound.isPlaying()) {
		sound.play();
	}
}

function connectPnts(index, xArr, yArr) {
	if (index > 2 && (index == 3 || (index + 4) % 3 == 0)) {
		bezier(xArr[index - 3], yArr[index - 3], 
			xArr[index - 2], yArr[index - 2], 
			xArr[index - 1], yArr[index - 1], 
			xArr[index], yArr[index]);
	}
}

function checkThreshold(type, index, rangeMin, rangeMax, threshold, value) {
	if (index < rangeMax && index > rangeMin){
		// console.log("range met");
		if (value <= threshold) {
			if (type == "star") {
				console.log("drawing star");
				// var star = {
				// 	xCord: random(w),
				// 	yCord: random(h / 2),
				// 	aVal: 250,
				// 	wVal: random(5, 10),
				// 	hVal: random(5, 20),
				// }
				var star = new Star(random(w), random(h / 2), random(100, 150), 
					random(8, 12), random(1, 3), random(8, 12));
				starArr.push(star);
			}
			else if (type == "ripple") {
				console.log("drawing ripple");
				// rippleX.push(random(w));
				// rippleY.push(random(h / 2, h));
				// rippleA.push(250);
				// rippleW.push(random(10, 20));
				// rippleH.push(rippleW[rippleW.length - 1] * .2);
				var ripple = new Ripple(random(w), random(h / 2, h), random(150, 200),
					random(10, 20), 10, 1.25);
				rippleArr.push(ripple);
			}
		}
	}
	
	// if (starRange >= starThreshold){
	// 	drawStar(0, PI / 300, 8, 20);
	// }

}

// function drawStar(index, sides) {
// 	push();
// 	noFill();
// 	var angle = 0;
// 	var speed = 2 * PI / sides;
// 	// stroke(255, 255, 255);
// 	translate(starsX[index], starsY[index]);
// 	for (var i = 0; i < sides; i++) {
// 		// starVal[0] = map(i, 0, sides, 255, 0);
// 		// starVal[1] = map(i, 0, sides, 255, 10);
// 		// starVal[3] = map(i, 0, sides, 20, 100);
// 		angle += speed;
// 		rotate(angle);
// 		// stroke(starVal[0], starVal[1], starVal[2], starVal[3]);
// 		triangle(-5, 0, 0, starSize[i], 5, 0);
// 	}
// 	pop();

// 	for (var i = 0; i < sides; i++) {
// 		triangle(starsX[index] - starSize[index], )
// 	}
// }

function drawStars(speed) {
	for (var i = 0; i < starArr.length; i++) {
		// var value = random(50, 255);
		noFill();
		// var size = random(5, maxSize);
		stroke(255, 255, 255, starArr[i].a);
		// drawStar(2);
		// triangle(100, 100, 105, 50, 110, 100);
		// rect(starArr[i].xCord, starArr[i].yCord, starArr[i].wVal, starArr[i].wVal);
		starArr[i].drawStar();

		// var angle = 0;
		// push();
		// noFill();
		// translate(starsX[i], starsY[i]);
		// for (var j = 0; j < sides; j++) {
		// 	starVal[0] = map(j, 0, sides, 255, 0);
		// 	starVal[1] = map(j, 0, sides, 255, 10);
		// 	starVal[3] = map(j, 0, sides, 20, 100);
		// 	angle += speed;
		// 	rotate(angle);
		// 	stroke(starVal[0], starVal[1], starVal[2], starsA[i]);
		// 	rect(0, 0, size, size);
		// }
		// pop();

		starArr[i].a -= speed;
	}
	deleteStar();
}

function deleteStar() {
	for (var i = 0; i < starArr.length; i++) {
		if (starArr[i].a <= 0) {
			starArr.splice(i, 1);
		}
	}
}

function drawRipples(speed) {
	noFill();
	for (var i = 0; i < rippleArr.length; i++) {
		rippleArr[i].drawRipple();
		// stroke(255, 255, 255, rippleA[i]);
		// ellipse(rippleX[i], rippleY[i], rippleW[i], rippleH[i]);
		// var offsetY = rippleH[i] * .15;
		// stroke(255, 255, 255, rippleA[i] - offsetA);
		// ellipse(rippleX[i], rippleY[i] - offsetY, rippleW[i] * scalar, rippleH * scalar);
		// rippleA[i] -= speedA;
		// rippleW[i] *= scalar;
		// rippleH[i] *= scalar;
		rippleArr[i].a -= speed;
	}
	deleteRipple();
}

function deleteRipple() {
	for (var i = 0; i < rippleArr.length; i++) {
		if (rippleArr[i].a <= 0) {
			rippleArr.splice(i, 1);
		}
	}
}

// function changeValue(freq) {
// 	var value = map(freq, 0, -amp, 30, 255);
// 	// if (freq > 150) {
// 	// 	valueArr = []
// 	// }
// 	valueArr = [0, 0, freq, 1];
// }
