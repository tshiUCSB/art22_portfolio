
var w = window.innerWidth;
var h = window.innerHeight;
var originX = 0;
var originY = 0;
var orbit1 = 150;
var orbit2 = 50;
var orbit3 = 25;
var angle1 = 0;
var angle1Speed = .051;
var angle2 = 0;
var angle2Speed = .051/2;
var angle3 = 0;
var angle3Speed = .051/3;

function setup() {
    createCanvas(w, h);
    background(0);
}

function draw() {
//    background(0);
    
    push();
    
    translate(w/2, h/2);
    
    angle1 += angle1Speed;
    rotate(angle1);
    stroke(255, 255, 255, 20);
    line(0, 0, orbit1, 0);
    fill(0, 255, 255, 20);
    rect(orbit1, 0, 4, 4);
        
    push();
    
    translate(orbit1, 0);
    angle2 += angle2Speed;
    rotate(angle2);
    line(0, 0, orbit2, 0);
    fill(255, 0, 255, 20);
    rect(orbit2, 0, 5, 5);
    
    pop();
    
    push();
    
    translate(orbit1, 0);
    angle3 += angle3Speed;
    rotate(angle3);
    
    fill(255, 255, 0, 30);
    line(0, 0, orbit3, 0);
    rect(orbit3, 0, 5, 5);
    
    pop();
    
    pop();
    
    fill(0, 255, 255);
    noStroke();
    text("x", w / 2, h / 2);
}

function createPolygon() {
    var sides = random(3, 10);
//    var 
    beginShape();
    for (var i = 0; i < sides; i++){
        vertex()
    }
}