// var w = window.innerWidth;
// var h = window.innerHeight;
var w = 1500;
var h = 1500;
console.log(w, h);
// var originX = 0;
// var orginY = 0;
var angRL, angFL, angAL;
var spedRL, spedFL, spedAL;
var radRL, radFL, radAL;
var angCenter, spedCenter;
var angElement, spedElement;
var orbitId, orbitEgo, orbitSuperEgo;
var CountDownOpacity;
var rajdhani;


function preload() {
	rajdhani = loadFont("fonts/rajdhani-light.ttf");
}

function setup() {
	createCanvas(w, w);
	background(color('#0e0d1b'));
	CountDownOpacity = 1;
	angRl = angFL = angAL = angElement = 0;
	spedRL = PI / 50.0;
	spedFL = PI / 300.0;
	spedAL = PI / 200.0;
	spedElement = PI / 200.0;
	angCenter = 0;
	spedCenter = PI / 700.0;
	orbitId = 200;
	orbitEgo = 350;
	orbitSuperEgo = 500;
	radRL = 75; radFL = 100; radAL = 150;
	ellipseMode(RADIUS);
	rectMode(RADIUS);
	textFont(rajdhani);
	noFill();
	stroke('rgba(255, 255, 255, 0.3)');
	strokeWeight(1);
	
	// drawCenter();
}

function draw() {
	background('#0e0d1b');
	
	drawCenter();
	drawStars(100);

	push();
	translate(w/2, w/2);
	// fill(255, 255, 255, CountDownOpacity);
	// CountDownOpacity -= .001;
	// if (CountDownOpacity <= 0) {
	// 	CountDownOpacity = 1;
	// }
	remSec = calculateCountDown();
	text(remSec, -33, -7, 50, 20);
	noFill();
	ellipse(0, 0, orbitId);
	ellipse(0, 0, orbitEgo);
	ellipse(0, 0, orbitSuperEgo);


	// ellipse(50, 0, 100);
	push();
	angFL += spedFL;
	rotate(angFL);
	noStroke();
	fill('rgba(0, 0, 255, .05)');
	ellipse(orbitEgo, 0, radFL);
	// drawOrbit(angFL, spedFL, orbitEgo, 0, radFL, 0, 0, 255, .05);

	push();
	translate(orbitEgo, 0);
	angElement += spedElement;
	rotate(angElement);
	fill('rgba(0, 255, 255, 1)')
	rect(radFL, 0, 2, 2);
	rect(-radFL, 0, 2, 2);

	pop();
	pop();

	push();
	angAL -= spedAL;
	// console.log(angAl);
	rotate(angAL);
	// console.log("rotate by angAL");
	noStroke();
	fill('rgba(255, 255, 0, .05)');
	ellipse(0, orbitSuperEgo, radAL);

	push();
	translate(0, orbitSuperEgo);
	angElement += spedElement;
	rotate(angElement);
	fill('rgba(0, 255, 0, 1)');
	rect(radAL, 0, 2, 2);
	// text("s", 0, radAL);

	pop();

	push();
	angRL += spedRL;
	rotate(angRL);
	noStroke();
	fill('rgba(255, 0, 0, .05)');
	ellipse(-orbitId, 0, radRL);

	pop();


	pop();


	pop();




}

function drawCenter() {
	// console.log("drawing center");
	push();
	noFill();
	translate(w/2, w/2);
	for (var i = 0; i < 8; i++) {
		// angCenter += spedCenter;
		rotate(angFL);
		ellipse(50, 0, 100);
		rect(50, 0, 100, 100);
	}
	// spedCenter = -spedCenter;
	pop();
}

function drawOrbit(angle, angleSped, orbitX, orbitY, orbitR, rVal, gVal, bVal, aVal) {
	// console.log(angle, angleSped);
	angle += angleSped;
	rotate(angle);
	noStroke();
	fill('rgba(' + rVal + ',' + gVal + ',' + bVal + ',' + aVal + ')');
	ellipse(orbitX, orbitY, orbitR);
}

function drawStars(amount) {
	for (var i = 0; i < amount; i++) {
		value = random(1, 255);
		fill('rgba(' + value + ',' + value + ',' + value + ',' + random(0, .3) + ')')
		rect(random(1, w), random(1, h), 1, 1);
	}
}

function calculateCountDown() {
	var s = second();
	var min = minute();
	var h = hour();
	var d = day();
	var mon = month();
	var y = year();
	var pastSec = 0;
	var remDay = 0;
	var remHr = 0;
	var remMin = 0;
	var remSec = 0;

	let leapYrNum = floor(y / 4);
	//Calculate past years
	if (y % 4 == 0) {
		pastSec += (365 * (y - 2000 - leapYrNum - 1) + 366 * (leapYrNum - 1)) * 24 * 60 * 60;
	}
	else {
		pastSec += (365 * (y - 2000 - leapYrNum - 1) + 366 * leapYrNum) * 24 * 60 * 60;
	}
	//Calculate past months
	for (var i = 1; i < mon; i++){
		if (i == 2) {
			if (y % 4 == 0) {
				pastSec += (29 * 24 * 60 * 60);
				continue;
			}
			pastSec += (28 * 24 * 60 * 60);
		}
		else if (i == 1 || i == 3 || i == 5 || i == 7 || i == 8 || i == 10 || i ==12) {
			pastSec += (31 * 24 * 60 * 60);
		}
		else {
			pastSec += (30 * 24 * 60 * 60);
		}
	}
	//Calculate past days
	pastSec += (d - 1) * 24 * 60 * 60;
	//Calculate past hours
	pastSec += (h - 1) * 60 * 60;
	//Calculate past minutes
	pastSec += (min - 1) * 60;
	pastSec += s;

	let totalSec = (365 * (100 - 25) + 366 * 25) * 24 * 60 * 60;
	
	remSec = totalSec - pastSec;

	return remSec;
}
