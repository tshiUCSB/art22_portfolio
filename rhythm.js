
var w = window.innerWidth;
var h = window.innerWidth / 16 * 9;

var timeVar, mergeInterval;
var rajdhani;

var r, rangeR, perfectR;
var fs;

var detectMode = true;

var isGameStarted = false;
var isPlayerReady = false;
var isGameEnded = false;
var loopOn = true;
var micOn = false;
var nyquist = 22050;
var secNum = 6;
var noteSpeed = 5;
var maxNoteSpeed = 9;
var bufferIterator = 0;
var mergeTime = 3000;
var musicOffsetTime = 5000;

var music, bufferMusic, fft, bufferFft, duration, noteFft, noteDetect, mic;
var hitCounter, comboCounter, maxCombo, keyEnum, pntRadius;
var startPoints = [];
var points = [];
var ripples = [];
var peaksArr = [];
var peaksTimeArr = [];
var noteBuffer1 = [];
var noteBuffer2 = [];
var currNoteBuffer = noteBuffer1;
var tmpNoteBuffer = noteBuffer2;
var onScreenBuffer = [];
var graphicBuffer = [];
var noteTimes = [];
var noteFreq = [];
var detectors = [];

class Point {
	constructor(posX, posY, radius, angle) {
		this.x = posX;
		this.y = posY;
		this.r = radius;
		this.theta = angle;
		this.strk = color(0, 0, 0, 255);
		this.connect = false;
	}

	draw() {
		ellipse(this.x, this.y, this.r, this.r);
	}

	setXY(originX, originY) {
		this.x = (this.r * cos(this.theta - PI / 2)) + originX;
		this.y = (this.r * sin(this.theta - PI / 2)) + originY;
	}

	setStrk() {
		// Set stroke of point by the gradient of which of the 4 quadrants
		// the note is located in
		var c1, c2;
		if (this.theta >= 0 && this.theta < PI / 2) {
			var amt = map(this.theta, 0, PI / 2, 0, 1);
			c1 = color(255, 102, 0, 255);
			c2 = color(0, 255, 162, 255);
			this.strk = lerpColor(c1, c2, amt);
		}
		else if (this.theta >= PI / 2 && this.theta < PI) {
			var amt = map(this.theta, PI / 2, PI, 0, 1);
			c1 = color(0, 255, 162, 255);
			c2 = color(0, 60, 255, 255);
			this.strk = lerpColor(c1, c2, amt);
		}
		else if (this.theta >= PI && this.theta < 3 * PI / 2) {
			var amt = map(this.theta, PI, 3 * PI / 2, 0, 1);
			c1 = color(0, 60, 255, 255);
			c2 = color(255, 0, 180, 255);
			this.strk = lerpColor(c1, c2, amt);
		}
		else if (this.theta >= 3 * PI / 2 && this.theta <  2 * PI) {
			var amt = map(this.theta, 3 * PI / 2, 2 * PI, 0, 1);
			c1 = color(255, 0, 180, 255);
			c2 = color(255, 102, 0, 255);
			this.strk = lerpColor(c1, c2, amt);
		}
		return this.strk;
	}
}

class Note {
	constructor(hitTime, freq, speed) {
		this.x = w / 2;
		this.y = h / 2;
		this.r = 0;
		this.freq = freq;
		this.timeOffset = (maxNoteSpeed - speed) * .5;
		this.hit = hitTime;
		this.q = hitTime - this.timeOffset;
		// this.spd = 1000 / speed;
		this.strk = color(255, 255, 255, 255);
		this.fill = color(255, 255, 255, 200);
		this.isInRange = false;
		this.isHit = false;
		this.isOnScreen = false;
		this.vertices = [];
	}

	setAlpha(newA) {
		var r = red(this.strk);
		var g = green(this.strk);
		var b = blue(this.strk);
		var a = newA;
		this.strk = color(r, g, b, a);
	}

	// setCue() {
	// 	// if (this.q < 0) {

	// 	// }
	// 	music.addCue(this.q, drawNote);
	// 	// music.addCue(this.hit, this.checkHit);
	// }

	initVertices(totalNum) {
		// if (totalNum < 4) {
		// 	totalNum += (4 - totalNum);
		// }
		var sector = 2 * PI / secNum * this.freq;
		for (var i = 0; i < totalNum; i++) {
			var pivotNum = (totalNum - (totalNum % 2 + 2)) / 2;
			var difference = 2 * PI / secNum / (totalNum % 2 + 1) * .9;
			var dSector = map(i, 0, totalNum - 1, pivotNum * -difference, 
				2 * PI / secNum + pivotNum * difference);
			// if (i < floor(totalNum / 2))
			// 	dSector = 0;
			// else if (i == floor(totalNum / 2))
			// 	dSector = 2 * PI / secNum / (totalNum % 2 + 1);
			// else
			// 	dSector = 2 * PI /secNum;
			// if (totalNum % 2 == 0) {
			// 	if (i == totalNum / 2)
			// 		dSector = 2 * PI / secNum / 3 * 2;
			// 	else if (i == totalNum / 2 - 1)
			// 		dSector = 2 * PI / secNum / 3;
			// 	else if (i < totalNum / 2 - 1)
			// 		dSector = 0;
			// 	else
			// 		dSector = 2 * PI / SecNum;
			// }
			// else {
			// 	if (i == floor(totalNum / 2))
			// 		dSector = 2 * PI 
			// }
			// var dSector = 2 * PI / secNum / (totalNum - 1) * i;
			var point = new Point(this.x, this.y, this.r, sector + dSector);
			point.setStrk();
			this.vertices.push(point);
			// console.log(i + ", " + this.vertices[i].theta);
		}
		// console.log(this.vertices);
	}

	calculateVertices() {
		// var dr = 25 / this.spd * r;
		if (this.r < r) {
			var newR = map(music.currentTime(), this.q, this.hit, 0, r);
			this.r = newR;
		}
		else {
			var dr = r / (this.timeOffset * 1000 / 25);
			this.r += dr;
		}
		for (var i = 0; i < this.vertices.length; i++) {
			this.vertices[i].r = this.r;
			this.vertices[i].setXY(this.x, this.y);
		}
	}

	initDraw() {
		this.initVertices(5);
		// console.log("cue time: " + this.q + ", actual time: " + music.currentTime());
		// console.log(this.vertices);
		this.strk = this.vertices[floor(this.vertices.length / 2)].strk;
		this.setAlpha(10);
		this.isOnScreen = true;
		this.isInRange = true;
		// var drawInterval = setInterval(calculateNoteCurve, 25, this, drawInterval);
	}

	draw() {
		// if (abs(music.currentTime() - this.hit) < .01) {
		// 	console.log("hit time: " + this.hit + ", actual time: " + music.currentTime()
		// 		+ ", radius dif: " + (r - this.r));
		// }
		this.calculateVertices();
		var a = alpha(this.strk);
		// var da = 25 / this.spd * 255;
		var da = (255 - 10) / this.timeOffset / 1000 * 25;
		if (this.isInRange) {
			this.checkInRange(1.15);
		}
		else {
			da = -5;
		}
		a += da;
		this.setAlpha(a);
		var weight = map(this.r, 0, r, 1, 5);
		stroke(this.strk);
		// stroke(255 - red(this.strk), 255 - green(this.strk), 
		// 	255 - blue(this.strk), alpha(this.strk));
		strokeWeight(weight);
		beginShape();
		for (var i = 0; i < this.vertices.length; i++) {
			curveVertex(this.vertices[i].x, this.vertices[i].y);
		}
		endShape();

		// colorMode(HSB);
		// stroke(color(convertRGBtoHSB(this.strk)));
		// strokeWeight(1);
		// beginShape();
		// for (var i = 0; i < this.vertices.length; i++) {
		// 	curveVertex(this.vertices[i].x, this.vertices[i].y);
		// }
		// endShape();
		// colorMode(RGB);
	}

	onHit(drawInterval) {
		var hitInterval = setInterval(function() {
			if (this.isHit) {
				clearInterval(drawInterval);
			}
		})
	}

	checkOutOfScreen() {
		if (alpha(this.strk) <= 0) {
			this.isOnScreen = false;
			return true;
		}
		// for(var i = 0; i < this.vertices.length; i++) {
		// 	if ((this.vertices[i].x >= 0 && this.vertices[i].x <= width) &&
		// 		this.vertices[i].y >= 0 && this.vertices[i].y <= height) {
		// 		return false;
		// 	}
		// }
		// this.isOnScreen = false;
		// return true;
		return false;
	}

	checkInRange(range) {
		if (this.r > r * range) {
			this.isInRange = false;
			this.strk = color(100, 100, 100, 150);
			return false;
		}
		return true;
	}

	// onOutOfScreen() {
	// 	var screenInterval = setInterval(checkNoteOutOfScreen(this, screenInterval), 25);
	// }

}

class Ripple {
	constructor(xCord, yCord, aVal, wVal, offsetA, scalar, strk) {
		this.x = xCord;
		this.y = yCord;
		this.a = aVal;
		this.w = wVal;
		this.h = this.w * 1;
		this.offA = offsetA;
		this.scalar = scalar;
		this.strk = strk;
	}

	drawRipple() {
		stroke(this.strk);
		strokeWeight(1);
		ellipse(this.x, this.y, this.w, this.h);
		// var offsetY = rippleH[i] * .15;
		this.setAlpha(this.a - this.offA);
		ellipse(this.x, this.y, this.w * this.scalar, this.h * this.scalar);
		this.w *= this.scalar;
		this.h *= this.scalar;
	}

	setAlpha(newA) {
		var r = red(this.strk);
		var g = green(this.strk);
		var b = blue(this.strk);
		this.a = newA;
		this.strk = color(r, g, b, this.a);
	}
}

class Particle {
	constructor(particleX, particleY, noiseX, noiseY, variationX, 
		variationY, strokeVal, radius) {
		this.px = particleX;
		this.py = particleY;
		this.nx = noiseX;
		this.ny = noiseY;
		this.vx = variationX;
		this.vy = variationY;
		this.strk = strokeVal;
		this.pntRadius = radius;
		this.r = 0;
		this.connect = false;
	}

	calculatePos() {
		this.vx += this.nx;
		this.vy += this.ny;
		this.px = noise(this.vx) * w;
		this.py = noise(this.vy) * h;
	}

	draw(isStatic) {
		fill(this.strk);
		stroke(this.strk);
		if (!isStatic) {
			this.calculatePos();
		}
		ellipse(this.px, this.py, this.pntRadius, this.pntRadius);
	}

	connectPrev(particle) {
			stroke(this.strk);
			line(this.px, this.py, particle.px, particle.py);
	}
}

function preload() {
	if (detectMode) {
		music = loadSound("sounds/SergeNarcissoff-Orion.mp3");
		bufferMusic = loadSound("sounds/SergeNarcissoff-Orion.mp3");
	}
	else {
		music = loadSound("sounds/mii-channel.mp3");
	}
	rajdhani = loadFont("fonts/rajdhani-light.ttf");
}

function setup() {
	var canvas = createCanvas(w, h);
	canvas.style('display', 'block');
	canvas.parent('sketch-container');
	ellipseMode(RADIUS);
	textFont(rajdhani);
	background(0);
	if (!loopOn) noLoop();

	r = .9 * height / 2;
	rangeR = .8 * r;
	perfectR = .925 * r;
	hitCounter = comboCounter = maxCombo = 0;
	fs = fullscreen();
	mic = new p5.AudioIn();
	fft = new p5.FFT();
	bufferFft = new p5.FFT();
	fft.setInput(music);
	bufferFft.setInput(bufferMusic);
	bufferMusic.disconnect();
	bufferMusic.connect(bufferFft);
	// music.connect(soundOut);
	noteFft = new p5.FFT();
	duration = music.duration();
	keyEnum = {
		0: {char: 'h', keyNum: 72, strk: color(255, 255, 255, 150), currStrk: color(255, 255, 255, 150)},
		1: {char: 'j', keyNum: 74, strk: color(255, 255, 255, 150), currStrk: color(255, 255, 255, 150)},
		2: {char: 'k', keyNum: 75, strk: color(255, 255, 255, 150), currStrk: color(255, 255, 255, 150)},
		3: {char: 'l', keyNum: 76, strk: color(255, 255, 255, 150), currStrk: color(255, 255, 255, 150)},
		4: {char: 'a', keyNum: 65, strk: color(255, 255, 255, 150), currStrk: color(255, 255, 255, 150)},
		5: {char: 's', keyNum: 83, strk: color(255, 255, 255, 150), currStrk: color(255, 255, 255, 150)},
		6: {char: 'd', keyNum: 68, strk: color(255, 255, 255, 150), currStrk: color(255, 255, 255, 150)},
		7: {char: 'f', keyNum: 70, strk: color(255, 255, 255, 150), currStrk: color(255, 255, 255, 150)}
	}

	if (detectMode) {
		initDetectors(detectBuffer, upperThreshold, midThreshold, 
			midLowThreshold, lowerThreshold);
		console.log("Initialized detectors:");
		console.log(detectBuffer);
		// console.log(Object.keys(detectBuffer[0]));
		// return;
	}

	initKeyStrokes();
	// initNotes(miiChannel.noteTimes, miiChannel.noteFreq, noteSpeed);

	console.log(Date());

}

function draw() {
	background(0);
	// drawFullScreenIcon();
	// if (detectMode) {
	// 	drawBackGraphic();
	// 	drawTimer();
	// 	drawTexts();
	// 	drawPointWave();
	// 	if (bufferMusic.isPlaying()) {
	// 		runDetectors(detectBuffer, bufferFft, bufferMusic, noteSpeed);
	// 		switchBuffer(currNoteBuffer, tmpNoteBuffer, noteBuffer1, noteBuffer2);
	// 	}
	// 	return;
	// }
	if (!isGameStarted && !isGameEnded) {
		drawStartGraphic();
	}
	else if (isGameStarted && !isGameEnded){
		drawBackGraphic();
		if (detectMode && bufferMusic.isPlaying()) {
			runDetectors(detectBuffer, bufferFft, bufferMusic, noteSpeed);
			// switchBuffer(currNoteBuffer, tmpNoteBuffer, noteBuffer1, noteBuffer2);
		}
		if (isPlayerReady && music.isPlaying()) {
			drawPointWave();
			drawTimer();
			drawTexts();
			checkDrawNote(currNoteBuffer);
			drawOnScreenNotes();
			drawRipples(ripples, 20);
			// detectNotes(detectors);
		}
		// else if (!music.isPlaying()) {
		// 	noLoop();
		// 	// console.log(noteTimes);
		// 	// console.log(noteFreq);
		// 	// console.log(noteBuffer);
		// }
	}
	else if (isGameEnded) {
		drawEndGraphic(graphicBuffer);
	}
}

function mousePressed() {
	// if (detectMode && !music.isPlaying()) {
	// 	music.play(3);
	// 	music.onended(endGame);
	// 	bufferMusic.play();
	// 	mergeInterval = setInterval(mergeDetectedNotes, 2000, detectBuffer, tmpNoteBuffer);
	// 	bufferMusic.onended(function() {
	// 		clearInterval(mergeInterval);
	// 	});
	// 	return;
	// }
	// else if (detectMode && music.isPlaying()) {
	// 	music.pause();
	// 	bufferMusic.pause();
	// 	return;
	// }
	if (mouseX >= 0 && mouseX <= width * .03 && mouseY >= 0 && mouseY <= width * .03) {
		fullscreen(!fs);
	}
	if (!micOn && !isGameStarted && mouseButton === LEFT) {
		micOn = true;
		mic.start();
		mic.connect(fft);
	}
	else if (!isGameStarted && mouseButton === LEFT && micOn) {
		isGameStarted = true;
		mic.stop();
	}
	// else if (isPlayerReady && !music.isPlaying()) {
	// 	var i = -3;
	// 	timeVar = setInterval(function() {
	// 		background(0);
	// 		drawBackGraphic();
	// 		stroke(255, 255, 255, 100);
	// 		textFont(rajdhani);
	// 		textSize(height * .1);
	// 		textAlign(CENTER, BASELINE);
	// 		text(i++, width * .1, height / 2);
	// 	}, 1000);
	// 	setTimeout(startMusic, 5000);
	// }
	else if (isPlayerReady && music.isPlaying() && 
		(mouseX >= width / 2 - r * .05) && (mouseX <= width / 2 + r * .05) 
		&& (mouseY >= height / 2 - r * .075) && (mouseY <= height / 2 + r * .05)){
		music.stop();
		bufferMusic.stop();
		noLoop();
		loopOn = false;
	}
	else if (isGameEnded && mouseButton === LEFT) {
		resetGame();
	}
	// else if (isPlayerReady && music.isPlaying()) {
	// 	music.pause();
	// 	noLoop();
	// 	loopOn = false;
	// 	// endGame();
	// 	// console.log("note times" + miiChannel.noteTimes);
	// 	// console.log("note freqs" + miiChannel.noteFreq);
	// }
}

function keyTyped() {
	// console.log(key);
	if (isGameStarted && !isPlayerReady && key === ' ') {
		// checkPlayerReady();
		isPlayerReady = true;
		if (isPlayerReady && !music.isPlaying()) {
			var i = musicOffsetTime / 1000 * -1;
			loopOn = false;
			noLoop();
			if (detectMode) {
				bufferMusic.play();
				console.log("bufferMusic: " + bufferMusic.isPlaying());
				mergeInterval = setInterval(mergeDetectedNotes, mergeTime, 
					detectBuffer, tmpNoteBuffer, currNoteBuffer);
				bufferMusic.onended(function() {
					clearInterval(mergeInterval);
				});
			}
			timeVar = setInterval(function() {
				background(0);
				drawBackGraphic();
				stroke(255, 255, 255, 100);
				textFont(rajdhani);
				textSize(height * .05);
				textAlign(LEFT, BASELINE);
				text(i++, width * .1, height / 2);
			}, 1000);
			var timeOut = 5000;
			if ((maxNoteSpeed - noteSpeed) * .5 * 1000 + mergeTime > 
				timeOut)
				setTimeout(startMusic, musicOffsetTime);
		}
	}
	if (isGameStarted || isPlayerReady) {
		// drawBackLetters();
		setKeyStrk(true);
	}
	if (isPlayerReady && music.isPlaying()) {
		checkHits();
	}
	return false;
}

function keyReleased() {
	if (isGameStarted || isPlayerReady) {
		setKeyStrk(false);
	}

}

function windowResized() {
	resizeCanvas(windowWidth, windowWidth * 9 / 16);
	var prevR = r;
	r = .9 * height / 2;
	rangeR = .8 * r;
	perfectR = .925 * r;
	recalculateBuffers(prevR);
	w = windowWidth;
	h = windowWidth * 9 / 16;
	
	redraw();

}

function recalculateBuffers(prevR) {
	// Reposition notes in note buffer
	for (var i = 0; i < noteBuffer1.length; i++) {
		noteBuffer1[i].x = width / 2;
		noteBuffer1[i].y = height / 2;
	}

	for (var i = 0; i < noteBuffer2.length; i++) {
		noteBuffer2[i].x = width / 2;
		noteBuffer2[i].y = height / 2;
	}

	// Reposition notes currently on screen
	for (var i = 0; i < onScreenBuffer.length; i++) {
		onScreenBuffer[i].x = width / 2;
		onScreenBuffer[i].y = height / 2;
	}
	// Reposition hit notes mapped to ending graphic
	for (var i = 0; i < graphicBuffer.length; i++) {
		graphicBuffer[i].x = map(graphicBuffer[i].x, w / 2 - prevR, 
			w / 2 + prevR, width / 2 - r, width / 2 + r);
		graphicBuffer[i].y = map(graphicBuffer[i].y, h / 2 - prevR, 
			h / 2 + prevR, height / 2 - r, height / 2 + r);
	}
}

function startMusic() {
	clearInterval(timeVar);
	music.play();
	console.log("music: " + music.isPlaying());
	loop();
	loopOn = true;
	music.onended(endGame);
	// addStub();
	// timeVar = setInterval(function() {
	// 	var currTime = music.currentTime();
	// 	var restTime = duration - currTime;
	// 	var min = floor(restTime / 60);
	// 	var sec = restTime - min * 60;
	// 	text(min + " : " + sec, 0, height / 2);
	// 	if (currTime >= duration) {
	// 		endGame();
	// 	}
	// }, 1000);
}

function endGame() {
	// console.log("note buffer");
	// console.log(noteBuffer);
	// console.log(noteTimes);
	// console.log(noteFreq);
	// music.stop();
	// if (detectMode) {
	// 	// console.log("times:");
	// 	// console.log(noteTimes);
	// 	// console.log("frequencies");
	// 	// console.log(noteFreq);
	// 	// printEnergy("bass");
	// 	// var response = prompt("keep detecting? Y/N", 'N');
	// 	// if (response == 'N') {
	// 	// 	detectMode = false;
	// 	// }
	// 	resetGame();
	// 	return;
	// }
	isGameStarted = false;
	isGameEnded = true;
	loop();
	loopOn = true;
}

function resetGame() {
	// if (detectMode) {
	// 	detectors.splice[0, detectors.length];
	// 	noteTimes.splice[0, noteTimes.length];
	// 	noteFreq.splice[0, noteFreq.length];
	// 	initDetectors(secNum, .35);
	// 	return;
	// }
	isGameStarted = false;
	isPlayerReady = false;
	isGameEnded = false;
	bufferIterator = 0;
	noteBuffer1.splice(0, noteBuffer1.length);
	noteBuffer2.splice(0, noteBuffer2.length);
	onScreenBuffer.splice(0, onScreenBuffer.length);
	graphicBuffer.splice(0, graphicBuffer.length);
	startPoints.splice(0, startPoints.length);
	points.splice(0, points.length);
	ripples.splice(0, ripples.length);
	hitCounter = comboCounter = maxCombo = 0;
	mic.start();
	mic.connect(fft);
	duration = music.duration();
	loopOn = true;
	loop();

	initKeyStrokes();
	// initNotes(miiChannel.noteTimes, miiChannel.noteFreq, 3);
}

function drawFullScreenIcon() {
	rect(width * .05, width * .05, width * .05, width * .05);
	rect(width * .06, width * .06, width * .03, width * .03);
}

function drawStartGraphic() {
	stroke(255, 255, 255, 200);
	textSize(height * .2);
	textAlign(CENTER, CENTER);
	text("RYHTHM", width / 2, height * .47);
	textSize(height * .03);
	// fill(255, 255, 255, 100);
	text("Left Click Anywhere To Start", width / 2, height * .70);
	var spectrum = fft.analyze();
	for (var i = 0; i < spectrum.length; i++) {
		var x = map(i, 0, spectrum.length, width, 0);
		var y = height / 2;
		var dy = map(spectrum[i], 0, 255, 0, -height * .3);
		stroke(255, 255, 255, 150);
		var point = new Point(x, y + dy, 1, 0);
		startPoints[i] = point;
	}
	for (var i = 0; i < startPoints.length; i++) {
		connectPnts(i, startPoints, startPoints.length, false);
	}
}

function drawEndGraphic(buffer) {
	drawEndTexts();
	for(var i = 0; i < buffer.length; i++) {
		stroke(buffer[i].strk);
		strokeWeight(1);
		fill(buffer[i].strk);
		buffer[i].draw(true);
		if (buffer[i].connect) {
			noFill();
			ellipse(buffer[i].px, buffer[i].py, buffer[i].r, buffer[i].r);
			if (i > 0 && buffer[i - 1].connect) {
				buffer[i].connectPrev(buffer[i - 1]);
			}
		}
	}
}

function drawEndTexts() {
	stroke(255, 255, 255, 50);
	strokeWeight(1);
	textSize(height * .03);
	text(floor(frameRate()), width * .01, height * .03);
	line(0, height / 2, width / 2 - 1.1 * r, height / 2);
	line(width, height / 2, width / 2 + 1.1 * r, height / 2);
	stroke(255, 255, 255, 100);
	textSize(height * .03);
	textAlign(LEFT, BASELINE);
	text("MAX COMBO " + maxCombo, width / 2 + 1.1 * r, height / 2);
	textSize(height * .03);
	textAlign(RIGHT, BASELINE);
	text("TOTAL HITS " + hitCounter + "/" + currNoteBuffer.length, 
		width / 2 - 1.1 * r, height / 2);
	textSize(height * .03);
	textAlign(CENTER, BASELINE);
	text("Left Click Anywhere to Restart", width / 2, height * .95);
}

function checkDrawNote(noteBuffer) {
	// console.log(abs(noteBuffer[bufferIterator].q - music.currentTime()));
	if (noteBuffer.length > bufferIterator && ((noteBuffer[bufferIterator].q < 0
		&& abs(noteBuffer[bufferIterator].q - bufferMusic.currentTime()
		- (musicOffsetTime / 1000)) <= .1) || (noteBuffer[bufferIterator].q - music.currentTime()) <= .1)) {
	// if (noteBuffer.length > bufferIterator && abs(noteBuffer[bufferIterator].q 
	// 	- music.currentTime()) <= .1) {
		// onScreenBuffer.push(noteBuffer[0]);
		onScreenBuffer.push(noteBuffer[bufferIterator]);
		onScreenBuffer[onScreenBuffer.length - 1].initDraw();
		bufferIterator++;
		console.log("iterator: " + bufferIterator);
	}
}

function checkPlayerReady() {
	// var allKeysPressed = false;
	// for (var i = 0; i < secNum; i++) {
	// 	// console.log("keydown: " + key);
	// 	if (i == 3 || i == 4) {
	// 		continue;
	// 	}
	// 	if (!keyIsDown(keyEnum[i].keyNum)) {
	// 		allKeysPressed = false;
	// 		break;
	// 	}
	// 	allKeysPressed = true;
	// }
	var allKeysPressed = (keyIsDown(keyEnum[0].keyNum) &&  
		keyIsDown(keyEnum[7].keyNum));
	if (allKeysPressed) {
		isPlayerReady = true;
		if (isPlayerReady && !music.isPlaying()) {
			var i = -3;
			timeVar = setInterval(function() {
				background(0);
				drawBackGraphic();
				stroke(255, 255, 255, 100);
				textFont(rajdhani);
				textSize(height * .05);
				textAlign(LEFT, BASELINE);
				text(i++, width * .1, height / 2);
			}, 1000);
			setTimeout(startMusic, 5000);
		}
	}
}

function checkHits() {
	// var spliceCounter = 0;
	for (var i = 0; i < onScreenBuffer.length; i++) {
		var noteKey = keyEnum[onScreenBuffer[i].freq].char;
		if(onScreenBuffer[i].isInRange && key === noteKey) {
			onScreenBuffer[i].isHit = true;
			var center = floor(onScreenBuffer[i].vertices.length / 2);
			var ripple = new Ripple(onScreenBuffer[i].vertices[center].x,
				onScreenBuffer[i].vertices[center].y, 200, 10, 10, 1.25, 
				onScreenBuffer[i].strk);
			var offset = calculateHitOffset(onScreenBuffer[i], ripple);
			ripple.setAlpha(ripple.a);
			ripples.push(ripple);
			if (offset <= r - rangeR) {
				hitCounter++;
				comboCounter++;
				var point = new Particle(random(width / 2 - r, width / 2 + r), 
					random(height / 2 - r, height / 2 + r), random(.0001, .003), 
					random(.001, .003), random(width * .1), random(height * .1), pntRadius, 1);
				// point = new Point(random(width / 2 - r, width / 2 + r), 
				// 	random(height / 2 - r, height / 2 + r), offset, 
				// 	onScreenBuffer[i].vertices[center].theta);
				calculateHitOffset(onScreenBuffer[i], point);
				point.connect = true;
				graphicBuffer.push(point);
			}
			else {
				resetCombo(i);
			}
			// spliceCounter++;
			onScreenBuffer.splice(i, 1);
			break;
		}
	}
	// onScreenBuffer.splice(0, spliceCounter);
}

function calculateHitOffset(note, graphic) {
	var offset = abs(r - note.r);
	var grey = color(60, 60, 60, 200);
	var radius = map(offset, 0, r, 40, 5);
	graphic.r = radius;
	if (offset <= r - perfectR)
		graphic.strk = note.strk;
	else if (offset <= r - rangeR) {
		var amt = map(offset, rangeR, r * .1, 0, .5);
		graphic.strk = lerpColor(grey, note.strk, amt);
	}
	else
		graphic.strk = grey;

	return offset;
}

function resetCombo(i) {
	if (maxCombo < comboCounter) {
		maxCombo = comboCounter;
	}
	comboCounter = 0;
	if (!onScreenBuffer) {
		return;
	}
	var center = floor(onScreenBuffer[i].vertices.length / 2);
	var point = new Particle(random(width / 2 - r, width / 2 + r), 
		random(height / 2 - r, height / 2 + r), random(.0001, .003), 
		random(.001, .003), random(width * .1), random(height * .1), pntRadius, 1);
	// point = new Point(random(width / 2 - r, width / 2 + r), 
	// 	random(height / 2 - r, height / 2 + r), 0, 
	// 	onScreenBuffer[i].vertices[center].theta);
	point.strk = onScreenBuffer[i].strk;
	graphicBuffer.push(point);
}

function drawOnScreenNotes() {
	if (!onScreenBuffer) {
		return;
	}
	for (var i = 0; i < onScreenBuffer.length; i++) {
		if (!onScreenBuffer[i].isInRange) {
			resetCombo(i);
		}
		if (onScreenBuffer[i].checkOutOfScreen() && !onScreenBuffer[i].isHit) {
			onScreenBuffer.splice(i, 1);
			i--;
			continue;
		}
		onScreenBuffer[i].draw();
	}
}

// function drawNote(noteBuffer) {
// 	onScreenBuffer.push(noteBuffer[0]);
// 	noteBuffer.splice(0, 1);
// 	if (onScreenBuffer.length > 0) {
// 		onScreenBuffer[onScreenBuffer.length - 1].initDraw();
// 	}
// 	// onScreenBuffer[onScreenBuffer.length - 1].initDraw();
// 	// console.log(onScreenBuffer);
// 	// var hitInterval = onScreenBuffer[lastIndex].onHit(drawInterval);
// 	// onScreenBuffer[lastIndex].onOutOfScreen();
// }

function calculateNoteCurve(note, drawInterval) {
	if (note.isHit || !note.isOnScreen) {
		clearInterval(drawInterval);
		// console.log("interval off");
	}
	// console.log("interval on");
	stroke(note.strk);
	note.calculateVertices();
}

// function checkNoteOutOfScreen(note, screenInterval) {
// 	for(var i = 0; i < note.vertices.length; i++) {
// 		if ((note.vertices[i].x >= 0 && note.vertices[i].x <= width) &&
// 			note.vertices[i].y >= 0 && note.vertices[i].y <= height) {
// 			return false;
// 		}
// 	}
// 	clearInterval(screenInterval);
// 	note.isOnScreen = false;
// 	return true;
// }

function drawRipples(rippleArr, speed) {
	noFill();
	for (var i = 0; i < rippleArr.length; i++) {
		rippleArr[i].drawRipple();
		rippleArr[i].a -= speed;
	}
	deleteRipple(rippleArr);
}

function deleteRipple(rippleArr) {
	for (var i = 0; i < rippleArr.length; i++) {
		if (rippleArr[i].a <= 0) {
			rippleArr.splice(i, 1);
		}
	}
}

function drawTexts() {
	stroke(255, 255, 255, 50);
	strokeWeight(1);
	textAlign(LEFT, BASELINE);
	textSize(height * .03);
	text(floor(frameRate()), width * .01, height * .03);
	stroke(255, 255, 255, 100);
	textSize(height * .05);
	text(comboCounter, width * .9, height / 2);

}

function drawTimer() {
	stroke(255, 255, 255, 100);
	strokeWeight(1);
	var currTime = music.currentTime();
	var restTime = floor(duration - currTime);
	// var min = floor(restTime / 60);
	// var sec = restTime - min * 60;
	textFont(rajdhani);
	textSize(height * .05);
	textAlign(LEFT, BASELINE);
	// text(restTime + " " + frameRate(), width * .1, height / 2);
	text(restTime, width * .1, height / 2);
	if (currTime >= duration) {
		endGame();
	}
}

function drawBackGraphic() {
	stroke(255, 255, 255, 150);
	strokeWeight(1);
	noFill();
	ellipse(width / 2, height / 2, r, r);
	line(0, height / 2, width, height / 2);
	stroke(255, 255, 255, 80);
	ellipse(width / 2, height / 2, rangeR, rangeR);
	stroke(255, 255, 255, 50);
	ellipse(width / 2, height / 2, perfectR, perfectR);
	if (!isPlayerReady) {
		stroke(255, 255, 255, 150);
		textAlign(CENTER, BASELINE);
		text("Press Space Bar to Ready Up", width / 2,
			height / 2);
	}
	else {
		if ((mouseX >= width / 2 - r * .05) && (mouseX <= width / 2 + r * .05) 
			&& (mouseY >= height / 2 - r * .075) && (mouseY <= height / 2 + r * .05)){
			stroke(255, 0, 0, 200);
		}
		ellipse(width / 2, height / 2, r * .05, r * .05);
		line(width / 2, height / 2 - r * .025, width / 2, height / 2 - r * .075);
	}
	for (var i = 0; i < secNum; i++) {
		stroke(255, 255, 255, 150);
		var theta = 2 * PI / secNum * i - PI / 2;
		var letterTheta = theta + PI / secNum;
		var w = width / 2;
		var h = height / 2;
		line(r * .75 * cos(theta) + w, r * .75 * sin(theta) + h, r * 1.25 * cos(theta) + w,
			r * 1.25 * sin(theta) + h);
		stroke(keyEnum[i].currStrk);
		textSize(height * .03);
		textAlign(CENTER, CENTER);
		// if (keyIsDown(keyEnum[i].keyNum)) {
		// 	stroke(keyEnum[i].strk);
		// 	console.log("key is down: " + keyNum[i].keyNum);
		// }
		text(keyEnum[i].char.toUpperCase(), r * 1.1 * cos(letterTheta) + w, r * 1.1 * sin(letterTheta) + h);
	}
}

function setKeyStrk(isPressed) {
	for (var i = 0; i < secNum; i++) {
		if (key === keyEnum[i].char) {
			if (isPressed) {
				// console.log("setstrk key" + i + " to " + keyEnum[i].strk);
				keyEnum[i].currStrk = keyEnum[i].strk;
				// console.log("currStrk is: " + keyEnum[i].currStrk);
			}
			else {
				// console.log("reset strk");
				keyEnum[i].currStrk = color(255, 255, 255, 150);
			}
			break;
		}
	}
}

function drawBackLetters() {
	for (var i = 0; i < secNum; i++) {
		stroke(255, 255, 255, 150);
		var theta = 2 * PI / secNum * i - PI / 2;
		var letterTheta = theta + PI / secNum;
		var w = width / 2;
		var h = height / 2;
		line(r * .75 * cos(theta) + w, r * .75 * sin(theta) + h, r * 1.25 * cos(theta) + w,
			r * 1.25 * sin(theta) + h);
		stroke(255, 255, 255, 100);
		textSize(height * .03);
		textAlign(CENTER, CENTER);
		if (keyIsDown(keyEnum[i].keyNum)) {
			stroke(keyEnum[i].strk);
			// console.log("key is down: " + keyEnum[i].keyNum);
		}
		text(keyEnum[i].char.toUpperCase(), r * 1.1 * cos(letterTheta) + w, r * 1.1 * sin(letterTheta) + h);
	}
}

// function initPoints() {
// 	for (var i = 0; i < 1024; i++) {
// 		var point = new Point(0.0, 0.0, 0.0, 0.0);
// 		points.push(point);
// 	}
// }

// function calculatePoints(pntRadius, threshold) {
// 	var spectrum = fft.analyze();
// 	var frontIndex = -1;
// 	var backIndex = -1;
// 	for (var i = 0; i < spectrum.length; i++) {
// 		if (spectrum[i] != 0 && frontIndex == -1) {
// 			frontIndex = i;
// 		}
// 		var digFromEnd = spectrum.length - 1 - i;
// 		if (spectrum[digFromEnd] != 0 && backIndex == -1) {
// 			backIndex = digFromEnd;
// 		}
// 		if (frontIndex != -1 && backIndex != -1) {
// 			break;
// 		}
// 	}
// 	if (frontIndex != -1 && backIndex != -1) {
// 		// console.log("frontI: " + frontIndex + ", backI: " + backIndex);
// 		for (var i = 0; i < backIndex - frontIndex + 1; i++) {
// 			var theta = map(i + frontIndex, frontIndex, backIndex, 0, 2 * PI);
// 			var dy = map(spectrum[i + frontIndex], 0, 255, 0, 1);
// 			threshold = map(threshold, 0, 255, 0, 1);
// 			if (dy < threshold) {
// 				dy = 0;
// 			}
// 			var x = width / 2 + cos(theta - (PI / 2)) * (1 + dy) * r;
// 			var y = height / 2 + sin(theta - (PI / 2)) * (1 + dy) * r;
// 			var point = new Point(x, y, pntRadius, theta);
// 			// console.log("theta: " + point.theta);
// 			point.setStrk();
// 			points[i] = point;
// 		}
// 		return backIndex - frontIndex + 1;
// 	}
// 	return 0;
// }

function calculatePoints(pntRadius, threshold, maxFreq) {
	var spectrum = fft.analyze();
	var maxIndex = maxFreq / nyquist * spectrum.length;
	for (var i = 0; i < spectrum.length; i++) {
		var theta = map(i, 0, maxIndex, 0, 2 * PI);
		var dy = map(spectrum[i], 0, 255, 0, 1);
		threshold = map(threshold, 0, 255, 0, 1);
		if (dy < threshold) {
			dy = 0;
		}
		var x = width / 2 + cos(theta - (PI / 2)) * (1 + dy) * r;
		var y = height / 2 + sin(theta - (PI / 2)) * (1 + dy) * r;
		var point = new Point(x, y, pntRadius, theta);
		// console.log("theta: " + point.theta);
		point.setStrk();
		points[i] = point;
	}
	return maxIndex;
}

function drawPoints() {
	var total = calculatePoints(1, 0, nyquist);
	for(var i = 0; i < total; i++) {
		points[i].draw();
	}
}

function drawPointWave() {
	var total = calculatePoints(1, 100, maxFrequency);
	strokeWeight(1);
	for (var i = 0; i < total; i++) {
		stroke(points[i].strk);
		connectPnts(i, points, total, true);
	}
}

function connectPnts(index, pointArr, length, loop) {
	if (loop && index == length - 1) {
		bezier(pointArr[length - 3].x, pointArr[length - 3].y, 
			pointArr[length - 2].x, pointArr[length - 2].y, 
			pointArr[length - 1].x, pointArr[length - 1].y, 
			pointArr[0].x, pointArr[0].y);
	}
	else if (index > 2 && (index == 3 || (index + 4) % 3 == 0)) {
		bezier(pointArr[index - 3].x, pointArr[index - 3].y, 
			pointArr[index - 2].x, pointArr[index - 2].y, 
			pointArr[index - 1].x, pointArr[index - 1].y, 
			pointArr[index].x, pointArr[index].y);
	}
}

// function initNotes(times, freq, speed) {
// 	for (var i = 0; i < times.length; i++) {
// 		note = new Note(times[i] - 1.5, freq[i], speed);
// 		noteBuffer.push(note);
// 	}
// }

function initKeyStrokes() {
	for (var i = 0; i < secNum; i++) {
		var theta = 2 * PI / secNum * i + PI / secNum;
		// var letterTheta = theta + PI / secNum;
		var p = new Point(0, 0, 0, theta);
		p.setStrk();
		keyEnum[i].strk = p.strk;
		// console.log(theta + ", " + p.strk);
	}
	// console.log(keyEnum);
}

// function setNoteCues() {
// 	for (var i = 0; i < noteBuffer.length; i++) {
// 		noteBuffer[i].setCue();
// 	}
// }

// function setStub(i) {
// 	console.log("cue reached " + peaksTimeArr[i]);
// 	var spectrum = noteFft.analyze();
// 	for (var j = 0; j < spectrum.length; j++) {
// 		if (abs(spectrum[j] - peaksArr[i]) <= 1) {
// 			console.log("frequency found");
// 			var noteStub = [peaksTimeArr[i], spectrum[j]];
// 			noteBuffer.push(noteStub);
// 			break;
// 		}
// 	}
// 	// var noteStub = {time:peaksArr[i], freq:}
// }

// function addStub() {
// 	for (var i = 0; i < peaksTimeArr.length; i++) {
// 		music.addCue(peaksTimeArr[i], setStub, i);
// 	}
// }

// function initDetectors(total, threshold) {
// 	var frac = nyquist / 8;
// 	for (var i = 0; i < total; i++) {
// 		var noteDetecter = new p5.PeakDetect(i * frac, (i + 1) * frac, threshold);
// 		detectors.push(noteDetecter);
// 		threshold -= .05;
// 	}
// }

// function detectNotes(detectors) {
// 	noteFft.analyze();
// 	for (var i = 0; i < detectors.length; i++) {
// 		detectors[i].update(noteFft);
// 		if (detectors[i].isDetected) {
// 			console.log("note detected at " + i);
// 			noteTimes.push(music.currentTime());
// 			noteFreq.push(i);
// 		}
// 	}
// }

function convertRGBtoHSB(color) {
	var r = red(color) / 255;
	var g = green(color) / 255;
	var b = blue(color) / 255;
	var a = alpha(color) / 255;
	var max = getExtrema(getExtrema(r, g, "max"), b, "max");
	var min = getExtrema(getExtrema(r, g, "min"), b, "min");
	var delta = max - min;
	var h;
	var s = (max == 0) ? 0 : (delta / max);
	var b = max;
	// Calculate h
	if (delta == 0) {
		h = 0;
	}
	else {
		switch (max) {
			case r:
				h = 60 * (g - b) / delta % 6;
				break;
			case g:
				h = 60 * (b - r) / delta + 2;
				break;
			case b:
				h = 60 * (r - g) / delta + 4;
		}
	}
	var newColor = 'hsba(' + h + ', ' + s + ', ' + b + ', ' + a + ')';
	return newColor;
}

function getExtrema(a, b, type) {
	var extrema;
	if (type == "max") {
		extrema = a > b ? a : b;
	}
	else if (type == "min") {
		extrema = a < b ? a : b;
	}
	else
		extrema = 0;
	return extrema;
}

