
var img;
var niko1, niko2, niko3, niko4, niko5;
//var x, y;
//var randSize = 40;
var cellSize, cellRow;
var pickedColor;
var speedY;
var nikoArr;
var randNiko;

function preload(){
    img = loadImage("images/colors_DM.jpg");
    niko1 = loadImage("images/niko_02.png");
    niko2 = loadImage("images/niko_13.png");
    niko3 = loadImage("images/niko_24.png");
    niko4 = loadImage('images/niko_30.png');
    niko5 = loadImage("images/niko_31.png");
}

function setup(){
    createCanvas(500, 500);
    cellRow = 14;
    cellSize = width / cellRow;
    y = 0;
    speedY = 0.1;
    nikoArr = [niko1, niko2, niko3, niko4, niko5];
    randNiko = niko1;
}

function draw(){
//    x = random(500);
//    y = random(500);
//    
//    var aColor = img.get(x, y);
//    fill(aColor);
//    rect(x, y, randSize, randSize);
//    noStroke();
//    randSize = random(4, 60);
    
    var x = 0;
    var currCell = 0;
    while(currCell < cellRow){
        pickedColor = randNiko.get(x  * .188, y * .188);
        fill(pickedColor);
        x = cellSize * currCell;
        rect(x, y, cellSize, cellSize);
        currCell++;
    }
    y+= cellSize;
    if (y > height){
        y = 0;
        cellRow = random(3, 200);
        cellSize = width / cellRow;
        speedY = random(0.4, 10);
//        background(0);
        randNiko = random(nikoArr);
    }
    
//    if (frameCount> 100){
//        background(0);
//    }
}