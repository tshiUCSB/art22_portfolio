var x = new Array();
var y = new Array();
//var x1 = y;
//var y1 = x;
var speedX = new Array();
var speedY = new Array();
var rectW = 150;
var rectH = 70;
// var valueR = 0;
// var valueG = 0;
// var valueB = 0;
var value = 0;
var valueDelta = 5;
var rectNum = 4;

function setup(){
    createCanvas(800, 721);
    background(70);
    for (var i = 0; i < rectNum; i++) {
        x[i] = rectW * i;
        y[i] = rectH * i;
        speedX[i] = 7;
        speedY[i] = 4.6;
    }
}

function draw(){
    for (var i = 0; i < rectNum; i++) {
        x[i] += speedX[i];
        y[i] += speedY[i];
    //    x1 = x1 + speedX;
    //    y1 = y1 + speedY;
        // valueDelta = random(-5, 5);
        value += valueDelta;
        
    //    fill(color('#cc1052'));
        stroke(value);
        strokeWeight(10);
        rect(x[i], y[i], rectW, rectH);
        rect(y[i], x[i], rectW, rectH);
        
        if (x[i] > width - rectW || x[i] < 0){
            speedX[i] = -speedX[i];
            value = 0;
            fill(color(random(0, 256), random(0, 256), random(0, 256)));
        }
        if (y[i] > height - rectH || y[i] < 0){
            speedY[i] = -speedY[i];
            value = 0;
            fill(color(random(0, 256), random(0, 256), random(0, 256)));
        }
    }

}