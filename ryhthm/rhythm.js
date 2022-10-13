
var w = window.innerWidth;
var h = window.innerWidth / 16 * 9;

var timeVar;
var rajdhani;

var r;

var isGameStarted = true;
var isGameEnded = false;
var loopOn = false;
var nyquist = 22050;
var secNum = 8;

var music, fft, duration, noteFft, noteDetect;
var hitCounter, comboCounter, maxCombo, keyEnum;
var points = [];
var ripples = [];
var peaksArr = [];
var peaksTimeArr = [];
var noteBuffer = [];
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
		this.timeOffset = speed * .5;
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

	setCue() {
		// if (this.q < 0) {

		// }
		music.addCue(this.q, drawNote);
		// music.addCue(this.hit, this.checkHit);
	}

	initVertices(totalNum) {
		var sector = 2 * PI / secNum * this.freq;
		for (var i = 0; i < totalNum; i++) {
			var point = new Point(this.x, this.y, this.r, sector + (2 * PI / secNum /
				(totalNum - 1) * i));
			point.setStrk();
			this.vertices.push(point);
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
		if (abs(music.currentTime() - this.hit) < .01) {
			console.log("hit time: " + this.hit + ", actual time: " + music.currentTime()
				+ ", radius dif: " + (r - this.r));
		}
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
		stroke(this.strk);
		var weight = map(this.r, 0, r, 1, 5);
		strokeWeight(weight);
		beginShape();
		for (var i = 0; i < this.vertices.length; i++) {
			curveVertex(this.vertices[i].x, this.vertices[i].y);
		}
		endShape();
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

function preload() {
	music = loadSound("sounds/mii-channel.mp3");
	rajdhani = loadFont("fonts/rajdhani-light.ttf");
}

function setup() {
	var canvas = createCanvas(w, h);
	canvas.style('display', 'block');
	canvas.parent('sketch-container');
	ellipseMode(RADIUS);
	textFont(rajdhani);
	background(0);

	r = .9 * height / 2;
	hitCounter = comboCounter = maxCombo = 0;
	fft = new p5.FFT();
	noteFft = new p5.FFT();
	duration = music.duration();
	keyEnum = {
		0: 'h',
		1: 'j',
		2: 'k',
		3: 'l',
		4: 'f',
		5: 'd',
		6: 's',
		7: 'a'
	}

	initNotes(miiChannel.noteTimes, miiChannel.noteFreq, 3);
	// setNoteCues();
	// initDetectors(secNum);

	// initPoints();
	console.log(Date());
	console.log("radius: " + r);
	// console.log("song duration: " + music.duration());
	// peaksArr = music.getPeaks(150);
	// console.log("peaks: " + peaksArr);
	// music.processPeaks(function(peaks) {
	// 		// console.log("peaks time: " + peaks);
	// 		peaksTimeArr = peaks;
	// 		// console.log("peaks time arr: " + peaksTimeArr);
	// 	// if (error)
	// 	// 	console.log(error);
	// });
	// console.log("lll", peaks);
}

function draw() {
	background(0);
	if (isGameStarted){
		drawBackGraphic();
		if (loopOn && music.isPlaying()) {
			drawPointWave();
			drawTimer();
			drawTexts();
			checkDrawNote();
			drawOnScreenNotes();
			drawRipples(ripples, 20);
			// detectNotes(detectors);
		}
		else if (!music.isPlaying()) {
			noLoop();
			// console.log(noteTimes);
			// console.log(noteFreq);
			// console.log(noteBuffer);
		}
	}
	else if (isGameEnded) {
		// drawEndGraphic(graphicBuffer, )
	}
}

function mousePressed() {
	if (!music.isPlaying()) {
		var i = -3;
		timeVar = setInterval(function() {
			background(0);
			drawBackGraphic();
			stroke(255, 255, 255, 100);
			textFont(rajdhani);
			text(i++, width * .1, height / 2);
		}, 1000);
		// var preStart = 0;
		// if (noteBuffer[0].q < 0) {
		// 	preStart = -noteBuffer[0].q;
		// }
		setTimeout(startMusic, 5000);
	}
	else if (music.isPlaying()) {
		music.pause();
		noLoop();
		loopOn = false;
		// console.log("note times" + miiChannel.noteTimes);
		// console.log("note freqs" + miiChannel.noteFreq);
	}
}

function keyTyped() {
	console.log(key);
	checkHits();
	return false;
}

function keyReleased() {

}

function windowResized() {
	w = windowWidth;
	h = windowWidth * 9 / 16;
	resizeCanvas(w, h);
	r = .9 * h / 2;
	redraw();

}

function startMusic() {
	clearInterval(timeVar);
	music.play();
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
	isGameStarted = false;
	isGameEnded = true;
}

function drawEndGraphic(buffer, pntRadius) {
	for(var i = 0; i < buffer.length; i++) {
		stroke(buffer[i].stroke);
		strokeWeight(1);
		fill(buffer[i].stroke);
		ellipse(buffer[i].x, buffer[i].y, pntRadius, pntRadius);
		if (buffer[i].connect) {
			noFill();
			ellipse(buffer[i].x, buffer[i].y, buffer[i].r, buffer[i].r);
			if (i + 1 < buffer.length && buffer[i + 1].connect) {
				line(buffer[i].x, buffer[i].y, buffer[i + 1].x, buffer[i + 1].y);
			}
		}
	}
}

function checkDrawNote() {
	if (noteBuffer.length > 0 && abs(noteBuffer[0].q - music.currentTime()) <= .1) {
		onScreenBuffer.push(noteBuffer[0]);
		onScreenBuffer[onScreenBuffer.length - 1].initDraw();
		noteBuffer.splice(0, 1);
	}
}

function checkHits() {
	// var spliceCounter = 0;
	for (var i = 0; i < onScreenBuffer.length; i++) {
		var noteKey = keyEnum[onScreenBuffer[i].freq];
		if(onScreenBuffer[i].isInRange && key === noteKey) {
			onScreenBuffer[i].isHit = true;
			var center = floor(onScreenBuffer[i].vertices.length / 2);
			var ripple = new Ripple(onScreenBuffer[i].vertices[center].x,
				onScreenBuffer[i].vertices[center].y, 200, 10, 10, 1.25, 
				onScreenBuffer[i].strk);
			var offset = calculateHitOffset(onScreenBuffer[i], ripple);
			ripple.setAlpha(ripple.a);
			ripples.push(ripple);
			if (offset < r * .5) {
				hitCounter++;
				comboCounter++;
				point = new Point(random(width / 2 - r, width / 2 + r), 
					random(height / 2 - r, height / 2 + r), offset, 
					onScreenBuffer[i].vertices[center].theta);
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
	var radius = map(offset, 0, r, 20, 5);
	var amt = map(offset, 0, r, 0, 1);
	graphic.r = radius;
	graphic.strk = lerpColor(note.strk, grey, amt);
	return offset;
}

function resetCombo(i) {
	if (maxCombo < comboCounter) {
		maxCombo = comboCounter;
	}
	comboCounter = 0;
	var center = floor(onScreenBuffer[i].vertices.length / 2);
	point = new Point(random(width / 2 - r, width / 2 + r), 
		random(height / 2 - r, height / 2 + r), 0, 
		onScreenBuffer[i].vertices[center].theta);
	point.strk = onScreenBuffer[i].strk;
	graphicBuffer.push(point);
}

function drawOnScreenNotes() {
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

function drawNote() {
	onScreenBuffer.push(noteBuffer[0]);
	noteBuffer.splice(0, 1);
	if (onScreenBuffer.length > 0) {
		onScreenBuffer[onScreenBuffer.length - 1].initDraw();
	}
	// onScreenBuffer[onScreenBuffer.length - 1].initDraw();
	// console.log(onScreenBuffer);
	// var hitInterval = onScreenBuffer[lastIndex].onHit(drawInterval);
	// onScreenBuffer[lastIndex].onOutOfScreen();
}

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
	line(0, height/2, width, height / 2);
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
	var total = calculatePoints(1, 0, nyquist);
	strokeWeight(1);
	for (var i = 0; i < total; i++) {
		stroke(points[i].strk);
		connectPnts(i, points, total);
	}
}

function connectPnts(index, pointArr, length) {
	if (index == length - 1) {
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

function initNotes(times, freq, speed) {
	for (var i = 0; i < times.length; i++) {
		note = new Note(times[i] - 1.5, freq[i], speed);
		noteBuffer.push(note);
	}
}

function setNoteCues() {
	for (var i = 0; i < noteBuffer.length; i++) {
		noteBuffer[i].setCue();
	}
}

function setStub(i) {
	console.log("cue reached " + peaksTimeArr[i]);
	var spectrum = noteFft.analyze();
	for (var j = 0; j < spectrum.length; j++) {
		if (abs(spectrum[j] - peaksArr[i]) <= 1) {
			console.log("frequency found");
			var noteStub = [peaksTimeArr[i], spectrum[j]];
			noteBuffer.push(noteStub);
			break;
		}
	}
	// var noteStub = {time:peaksArr[i], freq:}
}

function addStub() {
	for (var i = 0; i < peaksTimeArr.length; i++) {
		music.addCue(peaksTimeArr[i], setStub, i);
	}
}

function initDetectors(total) {
	var frac = nyquist / 8;
	for (var i = 0; i < total; i++) {
		var noteDetecter = new p5.PeakDetect(i * frac, (i + 1) * frac, .10);
		detectors.push(noteDetecter);
	}
}

function detectNotes(detectors) {
	noteFft.analyze();
	for (var i = 0; i < detectors.length; i++) {
		detectors[i].update(noteFft);
		if (detectors[i].isDetected) {
			console.log("note detected at " + i);
			noteTimes.push(music.currentTime());
			noteFreq.push(i);
		}
	}
}

