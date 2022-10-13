
// var fftArr = [];
// var spectrums = [];
var octaveBandCentrals = [16, 20, 25, 31.5, 40, 50, 63, 80, 100, 125,
	160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 
	2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 20000];
var maxFrequency = 4000;
var upperThreshold = .90;
var midThreshold = .85;
// var midThreshold = .70;
var midLowThreshold = .80;
var lowerThreshold = .70;
var framesPerPeak = 40;
var thresholdNum = 0;
var detectBuffer = [];

class Detector {
	constructor(min, max, threshold, freqIndex, thresholdIndex) {
		this.min = min;
		this.max = max;
		this.threshold = threshold;
		this.detector = new p5.PeakDetect(min, max, threshold);
		this.freqIndex = freqIndex;
		this.thresholdIndex = thresholdIndex;
		this.noteArr = [];
	}

	detectNote(noteFft, musicObj, speed) {
		this.detector.update(noteFft);
		if (this.detector.isDetected) {
			var note = new Note(musicObj.currentTime(), this.freqIndex, speed);
			this.noteArr.push(note);
			// detectArr[this.freqIndex][thresholdIndex].buffer.push(bufferNote);
		}
	}

	removeCloseNotes(margin) {
		for (var i = 1; i < this.noteArr.length; i++) {
			if (abs(this.noteArr[i].hit - this.noteArr[i - 1].hit) < margin) {
				this.noteArr.splice(i, 1);
				i--;
			}
		}
	}
}



// function mergeNotes(detectArr, noteArr) {
// 	var earliestNoteArr = detectArr[0][0].noteArr;
// 	for (var detectorGroup in detectorGroups) {
// 		var detector = getNoteDetector(detectorGroup, .01);
// 		if (detector && (earliestNoteArr.length == 0 || 
// 			detector.noteArr[0].hit < earliestNoteArr[0].hit)) {
// 			earliestNoteArr = detector.noteArr;
// 		}
// 	}
// 	if (earliestNoteArr.length > 0) {
// 		noteArr.push(earlistNoteArr[0]);
// 		earlistNoteArr.splice(0, 1);
// 	}
// }

function switchBuffer(currBuffer, tmpBuffer, buffer1, buffer2) {
	if (tmpBuffer.length > 0 && bufferIterator >= currBuffer.length) {
		bufferIterator = 0;
		currBuffer.splice(0, currBuffer.length);
		if (currBuffer == buffer1) {
			currBuffer = buffer2;
			tmpBuffer = buffer1;
			console.log("switch buffer2 to curr");
		}
		else {
			currBuffer = buffer1;
			tmpBuffer = buffer2;
			console.log("switch buffer1 to curr");
		}
	}
}

function mergeDetectedNotes(detectArr, noteArr, currArr) {
	for (var i = 0; i < detectArr.length; i++) {
		var detector = getHighestDetector(detectArr[i], .01);
		if (detector) {
			for (var j = 0; j < detector.noteArr.length; j++) {
				noteArr.push(detector.noteArr[j]);
			}
			detector.noteArr.splice(0, detector.noteArr.length);
		}
	}
	noteArr.sort(function(note1, note2) {return note1.hit - note2.hit});
	for (var i = 0; i < noteArr.length; i++) {
		currArr.push(noteArr[i]);
	}
	noteArr.splice(0, noteArr.length);
	console.log(currArr.length);
}

function getHighestDetector(detectorGroup, margin) {
	var noteDetected = false;
	var noteDetector = null;
	for (var detector in detectorGroup) {
		if (detectorGroup[detector].noteArr.length > 0 && !noteDetected) {
			detectorGroup[detector].removeCloseNotes(margin);
			noteDetector = detectorGroup[detector];
			noteDetected = true;
			continue;
		}
		detectorGroup[detector].noteArr.splice(0, detectorGroup[detector].noteArr.length);
	}
	return noteDetector;
}

function runDetectors(detectArr, fftObj, musicObj, speed) {
	fftObj.analyze();
	for (var i = 0; i < detectArr.length; i++) {
		// console.log(detectArr[i]);
		for (var detector in detectArr[i]) {
			// console.log(detector);
			detectArr[i][detector].detectNote(fftObj, musicObj, speed);
		}
	}
}

// function RemoveCloseNotes(noteArr, margin) {
// 	for (var i = 1; i < noteArr.length; i++) {
// 		if (abs(noteArr[i].hitTime - noteArr[i - 1].hitTime) < margin) {
// 			noteArr.splice(i, 1);
// 			i--;
// 		}
// 	}
// }


function initDetectors(detectArr, ...thresholds) {
	thresholds = thresholds.sort(function(t1, t2) {return -(t1 - t2)});
	thresholdNum = thresholds.length;
	for(var i = 0; i < secNum; i++) {
		var bounds = calculateSectorBounds(maxFrequency, i);
		detectArr[i] = {};
		for(var j = 0; j < thresholds.length; j++) {
			// console.log("lower: " + bounds[0] + ", upper: " + bounds[1] + " threshold: " + thresholds[j]);
			var newDetector = new Detector(bounds[0], bounds[1], thresholds[j], i, j);
			var bufferObj = {};
			// bufferObj[j] = {detector: newDetector, buffer: []};
			bufferObj[j] = newDetector;
			Object.assign(detectArr[i], bufferObj);
		}
		// var upperDetector = new Detector(bounds[0], bounds[1], 
		// 	upperThreshold, i);
		// var lowerDetector = new Detector(bounds[0], bounds[1], 
		// 	lowerThreshold, i);
		// detectArr[i] = {
		// 	0: {detector: upperDetector, buffer: []},
		// 	1: {detector: lowerDetector, buffer: []}
		// };
	}
}

function calculateSectorBounds(maxFreq, freqIndex) {
	var secRange = maxFreq / secNum;
	var lower = freqIndex * secRange;
	var upper = (freqIndex + 1) * secRange;
	var bounds = [lower, upper];
	return bounds;
}

function getHighestFreq(fftObj) {
	var spectrum = fftObj.analyze();
	var i = spectrum.length - 1;
	while(spectrum[i] == 0) {
		i--;
	}
	var highestFreq = i * nyquist / fftObj.length;
	return highestFreq;
}


function calculateThreshold() {
	var avgAmp;
	var maxAmp = 0;
}

function calculateOctaveBound(central, n, type) {
	var bound = central;
	if (type == "lower") {
		bound = central / pow(pow(2, .5), 1 / n);
	}
	else if (type == "upper") {
		bound = central * pow(pow(2, .5), 1 / n);
	}
	return bound;
}

// function initFft() {
// 	var newFft = new p5.FFT();
// 	newFft.analyze();
// 	fftArr.push(newFft);
// }

// function printEnergy(freq) {
// 	console.log("test FFT buffer: ");
// 	for(var i = 0; i < fftArr.length; i++) {
// 		console.log(fftArr[i].getEnergy(freq));
// 	}
// }

// function getFreqRange(ffts, spectrums, totalBin) {
// 	var minFreq = 0;
// 	var maxFreq = nyquist;
// 	var centroidSum = 0;
// 	for (var i = 0; i < ffts.length; i++) {
// 		var minIdx = 0;
// 		var maxIdx = totalBin;
// 		centroidSum += ffts[i].getCentroid();
// 		for (var j = 0; j < totalBin && (spectrums[i][j] == 0 || 
// 			spectrum[totalBin - j] == 0); j++) {
// 			if (spectrums[i][j] == 0) {
// 				minIdx = j;
// 			}
// 			if (spectrum[totalBin - j] == 0) {
// 				maxIdx = totalBin - j;
// 			}
// 		}
// 		minFreq = getExtrema(minFreq, minIdx * nyquist / totalBin, min);
// 		maxFreq = getExtrema(maxFreq, maxIdx * nyquist / totalBin, max);
// 	}
// 	var freqRange = {
// 		min: minFreq,
// 		max: maxFreq,
// 		avgCentroid: centroidSum / ffts.length};
// 	return freqRange;
// }

// function calculateSectorBounds(range, n, noteFft) {
// 	var minDif = nyquist;
// 	var minCentral = range.min;
// 	var minCentralIndex = 0;
// 	for (var i = 0; i < octaveBandCentrals.length; i++) {
// 		var currDif = abs(octaveBandCentrals[i] - range.min);
// 		if (currDif < minDif) {
// 			minDif = currDif;
// 			minCentral = octaveBandCentrals[i];
// 			minCentralIndex = i;
// 		}
// 		else
// 			break;
// 	}
// 	var octaveBands = noteFft.getOctaveBands(n, minCentral);
// 	var bandNum = floor(octaveBands.length / secNum);
// 	var bandRemainder = octaveBands.length % secNum;
// 	var i = 0;
// 	var j = minCentralIndex;
// 	var sectorBounds = [];
// 	while (i < secNum && j < octaveBandCentrals.length) {
// 		var lower = calculateOctaveBound(j, n, "lower");
// 		var upper;
// 		j += bandNum;
// 		if (i < bandRemainder) {
// 			j++;
// 		}
// 		upper = calculateOctaveBound(j, n, "upper");
// 		var bound = {
// 			lower: lower,
// 			upper: upper
// 		};
// 		sectorBounds.push(bound);
// 		i++;
// 	}
// 	return sectorBounds;
// }
