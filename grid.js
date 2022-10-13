
var cellSize, totalRows, totalCols;
var x = [], y = [], type = [];

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);
	startGrid();
}

function draw() {
	background(0);
	showGrid();
}

function startGrid() {
	totalRows = Width / cellSize;
	totalCols = Height / cellSize;
	for (var i = 0; i < totalRows; i++) {
		x[i] = [];
		y[i] = [];
		type[i] = [];
		for (var j = 0; j < totalCols; j++) {
			x[i][j] = cellSize * j;
			y[i][j] = cellSize * i;
			type[i][j] = floor(random(1, 4));
		}
	}
}

function showGrid() {
	for (var i = 0; i < totalRows; i++) {
		for (var j = 0; j < totalCols; j++) {
			fill(255);
			ellipse(x[i][j], y[i][j], 3, 3);
			noFill();
			stroke(255);
			strokeWeight(random(1));
			rectMode(CENTER);
			rect(x[i][j], y[i][j], cellSize - 2, cellSize - 2);
			if (type[i][j] == 1) {
				fill(255);
				rect(x[i][j], y[i][j], cellSize - 2, cellSize - 2);
			}
			else if (type[i][j] == 2) {
				stroke(255);
				line(x[i][j] - cellSize / 2, y[i][j] - cellSize / 2,
					x[i][j] + cellSize / 2, y[i][j] + cellSize / 2);
				line(x[i][j] + cellSize / 2, y[i][j] - cellSize / 2,
					x[i][j] - cellSize / 2, y[i][j] + cellSize / 2);
			}
		}
	}
}