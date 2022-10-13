
var w = window.innerWidth;
var h = window. innerHeight;
var music, fft, amp, isReady;
var a1, a2, b1, b2;
var r, len;
var pntPosX = new Array();
var pntPosY = new Array();
var wavePosX = new Array();
var wavePosY = new Array();
var waveMaxI = new Array();


function preload() {
	music = loadSound("sounds/Lena_Raine_-_Celeste_02_First_Steps.m4a");
}

function setup() {
	createCanvas(w, h);
	// var quartW = w / 2;
	// var quartH = h / 2;
	background(0);
	ellipseMode(RADIUS);
	fft = new p5.FFT();
	r = .25 * h;
	isReady = false;
	amp = .2 * h;

	initWaveArr(2);

	noFill();
	stroke(255, 255, 255, 40);
	ellipse(w / 2, h / 2, r, r);

	a1 = createGraphics(w, h / 2);
	a2 = createGraphics(w, h / 2);
	// a1.background(255);
	a1.ellipseMode(RADIUS);
	a2.ellipseMode(RADIUS);
	a1.fill(255);
	// a1.ellipse(a1.width / 2, a1.height / 2, 20, 20);

}

function draw() {
	if (isReady) {
		background(0);
		noFill();
		stroke(255, 255, 255, 40);
		ellipse(w / 2, h / 2, r, r);
		var spectrum = drawMusic();
		drawWave(a1, spectrum, 0, 3, 0, len / 2 - 1);
		drawWave(a2, spectrum, 1, 3, len / 2 - 1, len - 1);
		image(a1, 0, h / 2, w, h / 2);
		image(a2, 0, 0, w, h / 2);
	}
	

	// image(a1, 0, 0);
	
}

function mousePressed() {
	if (!music.isPlaying()) {
		music.play();
		loop();
		console.log("play music");
		isReady = true;
	}
	else if (music.isPlaying()) {
		music.pause();
		noLoop();
		isReady = false;
	}
}

function drawMusic() {
	var spectrum = fft.analyze();
	var color1 = color(255, 102, 0);
	var color2 = color(0, 0, 255);
	len = floor(.85 * spectrum.length);
	noFill();
	for (var i = 0; i < len; i++) {
		var theta = map(i, 0, len, 0, 2 * PI);
		var amt = map(i, 0, len, 0, 1);
		stroke(lerpColor(color1, color2, amt));
		var deltaR = map(spectrum[i], 0, 255, 0, amp);
		var x = w / 2 + (r + deltaR) * cos(theta);
		var y = h / 2 + (r + deltaR) * sin(theta);
		// ellipse(x, y, 2, 2);
		pntPosX[i] = x;
		pntPosY[i] = y;
		connectPnts(i, pntPosX, pntPosY);
	}
	return spectrum;
}

function connectPnts(index, xArr, yArr) {
	if (index == len) {
		bezier(xArr[len - 3], yArr[len - 3], 
			xArr[len - 2], yArr[len - 2], 
			xArr[len - 1], yArr[len - 1], 
			xArr[0], yArr[0]);
	}
	else if (index > 2 && (index == 3 || (index + 4) % 3 == 0)) {
		bezier(xArr[index - 3], yArr[index - 3], 
			xArr[index - 2], yArr[index - 2], 
			xArr[index - 1], yArr[index - 1], 
			xArr[index], yArr[index]);
	}
}

function initWaveArr(total) {
	for (var i = 0; i < total; i++) {
		wavePosX[i] = 0;
		wavePosY[i] = 0;
		waveMaxI[i] = 0;
	}
}

function calculateWave(graphic, spectrum, position, speed, start, end) {
	if (wavePosX[position] == 0) {
		waveMaxI[position] = findMax(spectrum, start, end);
	}
	wavePosX[position] += speed;
	wavePosY[position] = r * sin(map(waveMaxI[position], 0, len, 0, 2 * PI)
		- map(spectrum[waveMaxI[position]], 0, 255, 0, .7 * graphic.height));
	if (wavePosX[position] >= w) {
		resetWave(graphic, position);
	}
}

function drawWave(graphic, spectrum, position, r, start, end) {
	calculateWave(graphic, spectrum, position, 10, start, end);
	var color1 = color(255, 102, 0);
	var color2 = color(0, 0, 255);
	var amt = map(waveMaxI[position], 0, len, 0, 1);
	var newColor = lerpColor(color1, color2, amt);
	graphic.fill(newColor);
	graphic.stroke(newColor);
	graphic.ellipse(wavePosX[position], wavePosY[position], r, r);
}

function resetWave(graphic, position) {
	wavePosX[position] = 0;
	graphic.clear();
}

function findMax(arr, start, end) {
	var max = start;
	for (var i = start; i < end; i++) {
		if (arr[i] > arr[max]) {
			max = i;
		}
	}
	return max;
}


