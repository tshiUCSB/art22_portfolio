
var w = window.innerWidth;
var h = window.innerHeight;
console.log(w, h);
var value, dValue;
var spriteFront = new Array();
var spriteBack = new Array();
var spriteLeft = new Array();
var spriteRight = new Array();
var sprite, moveCount;
var imgW, imgH, x, y, dx, dy;
var orbit1, sped1;





function preload() {
	spriteFront[0] = loadImage("images/sprites/niko_front.png");
    spriteFront[1] = loadImage("images/sprites/niko_front_stepR.png");
    spriteFront[2] = loadImage("images/sprites/niko_front_stepL.png");
    spriteBack[0] = loadImage("images/sprites/niko_back.png");
    spriteBack[1] = loadImage("images/sprites/niko_back_stepL.png");
    spriteBack[2] = loadImage("images/sprites/niko_back_stepR.png");
    spriteLeft[0] = loadImage("images/sprites/niko_left.png");
    spriteLeft[1] = loadImage("images/sprites/niko_left_step.png");
    spriteRight[0] = loadImage("images/sprites/niko_right.png");
    spriteRight[1] = loadImage("images/sprites/niko_right_step.png");
}

function setup() {
	createCanvas(w, h);
	value = 10;
	dValue = 10;
	background(0);
	sprite = spriteFront[0];
	moveCount = 0;
	imgW = 40;
	imgH = 52;
	x = w / 2 - imgW;
	y = h / 2 - imgH;
	dx = 0;
	dy = 0;
	orbit1 = 0;
	sped1 = PI / 200;
	// fill(255);
	// image(sprite, x, y, imgW, imgH);
	// rectMode(CENTER);
}

function draw() {
	// console.log("draw");
	x += dx;
	y += dy;
	image(sprite, x, y, imgW, imgH);
	moveSprite();
	drawTrail();
	drawOrbit(random(w), random(h), orbit1, sped1);
	// ellipse(w / 2, h + 30, 10, 10);
	
}

function keyReleased(){
    dx = 0;
    dy = 0;
    if (sprite == spriteFront[1] || sprite == spriteFront[2]){
        sprite = spriteFront[0];
    }
    else if (sprite == spriteBack[1] || sprite == spriteBack[2]){
        sprite = spriteBack[0];
    }
    else if (sprite == spriteLeft[1]){
        sprite = spriteLeft[0];
    }
    else if (sprite == spriteRight[1]){
        sprite = spriteRight[0];
    }
}

function moveSprite() {
	if (keyIsDown(83)){
        movement(0, 3, spriteFront);
    }
    else if (keyIsDown(87)){
        movement(0, -3, spriteBack);
    }
    else if (keyIsDown(65)){
        movement(-3, 0, spriteLeft);
    }
    else if (keyIsDown(68)){
        movement(3, 0, spriteRight);
    }
}

function movement(dirX, dirY, moveSet){
	// console.log("movement");
    if (x > w - imgW){
        dx = -5;
        value += dValue;
    	background(value);
    }
    else if (x < 0){
        dx = 5;
        value += dValue;
    	background(value);
    }
    else{
        dx = dirX;
    }
    
    if (y > h - imgH){
        dy = -5;
        value += dValue;
        background(value);
    }
    else if (y < 0){
        dy = 5;
        value += dValue;
        background(value);
    }
    else{
        dy = dirY;
    }

    if (frameCount % 40 > 20){
    	sprite = moveSet[moveCount % moveSet.length];
    	moveCount++;
    }

    if (value >= 260 || value <= 0) {
    	console.log(value);
    	dValue = -dValue;
    }
    //     if(sprite_snapShot == move2){
    //         sprite = move1;
    //     }
    //     else{
    //         sprite = move2;
    //     }
    //     sprite_snapShot = sprite;
    // }
    // else{
    //     sprite = rest;
    // }
}

function drawTrail() {
	stroke(random(255), random(255), random(255));
	fill(random(255), random(255), random(255), random(.3, 1));
	rect(x - 5, y, 50, 50);
}

function drawOrbit(rotX, rotY, angle, speed) {
	if (frameCount % 40 > 20){
		push();
		angle += speed;
		rotate(angle);
		fill(random(value), random(value), random(value));
		var circleSize = random(3, 100);
		ellipse(rotX, rotY, circleSize, circleSize);
		pop();
	}

}