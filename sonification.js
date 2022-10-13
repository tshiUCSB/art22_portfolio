var dataSet;
var maxSize, totals, y;
var x = [];
var levels = [];
var labels = [];
var finalSize = [];
var currSize = [];



function preload() {
	dataSet = loadTable('data/year-happiness.csv', 'csv', 'header');
}

function setup() {
	maxSize = 250;
	var canvas = createCanvas(windowWidth, windowHeight);
	canvas.background(0);
	y = canvas.height / 2;
	initArrays();
}

function draw() {
	background(0);
	drawHappiness();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	y = windowHeight / 2;
	resetXToWindow();

}

function initArrays() {
	totals = dataSet.getRowCount();
	for (var i = 0; i < totals; i++) {
		levels[i] = dataSet.getString(i, 1);
		labels[i] = dataSet.getString(i, 0);
		x[i] = map(labels[i], 2000, 2019, .2 * width, .8 * width);
		finalSize[i] = map(levels[i], 0, 10, .2 * height, .5 * height);
		currSize[i] = 0;
	}
}

function resetXToWindow() {
	for (var i = 0; i < totals; i++) {
		x[i] = map(labels[i], 2000, 2019, .2 * windowWidth, .8 * windowWidth);
		finalSize[i] = map(levels[i], 0, 10, .2 * windowHeight, .5 * windowHeight);
	}
}

function drawHappiness() {
	for (var i = 0; i < totals; i++) {
		fill(255);
		stroke(255);
		strokeWeight(random(1));
		ellipse(x[i], y, 2, 2);

		textSize(9);
		textAlign(CENTER);
		text(labels[i], x[i], y - 10);

		noFill();
		ellipse(x[i], y, currSize[i], currSize[i]);
		if (currSize[i] < finalSize[i]) {
			currSize[i]++;
		}
	}
}

function mousePressed() {
	for (var i = 0; i < totals; i++) {
		currSize[i] = 0;
	}
}