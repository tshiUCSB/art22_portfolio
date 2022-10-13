
var w = window.innerWidth;
var h = window.innerHeight;
console.log(w, h);
var imgW = 40;
var imgH = 52;
var x = w / 2 - imgW;
var y = h / 2 - imgH;
var dx = 0;
var dy = 0;
//var img1, img2;
var f1, f2, f3;
var b1, b2, b3;
var l1, l2, r1, r2;
var sprite;
var sprite_snapShot;

function preload(){
//    img1 = loadImage("images/niko_13.png");
//    img2 = loadImage("images/niko_24.png");
    f1 = loadImage("images/sprites/niko_front.png");
    f2 = loadImage("images/sprites/niko_front_stepR.png");
    f3 = loadImage("images/sprites/niko_front_stepL.png");
    b1 = loadImage("images/sprites/niko_back.png");
    b2 = loadImage("images/sprites/niko_back_stepL.png");
    b3 = loadImage("images/sprites/niko_back_stepR.png");
    l1 = loadImage("images/sprites/niko_left.png");
    l2 = loadImage("images/sprites/niko_left_step.png");
    r1 = loadImage("images/sprites/niko_right.png");
    r2 = loadImage("images/sprites/niko_right_step.png");
    sprite = f1;
}

function setup(){
    createCanvas(w, h);
    
}

function draw(){
    background(0);
    x += dx;
    y += dy;
    image(sprite, x, y, imgW, imgH);
    if (keyIsDown(83)){
        movement(0, 3, f1, f2, f3);
    }
    else if (keyIsDown(87)){
        movement(0, -3, b1, b2, b3);
    }
    else if (keyIsDown(65)){
        movement(-3, 0, l1, l2, l2);
    }
    else if (keyIsDown(68)){
        movement(3, 0, r1, r2, r2);
    }
    
    
//    if (frameCount % 40 > 20){
//        image(img2, x, y, 50, 50)
//    }
//    else{
//    image(img1, x, y, 50, 50);
//    }
}

function keyReleased(){
    dx = 0;
    dy = 0;
    if (sprite == f2 || sprite == f3){
        sprite = f1;
    }
    else if (sprite == b2 || sprite == b3){
        sprite = b1;
    }
    else if (sprite == l2){
        sprite = l1;
    }
    else if (sprite == r2){
        sprite = r1;
    }
}

function movement(dirX, dirY, rest, move1, move2){
    if (x > w - imgW){
        dx = -5;
    }
    else if (x < 0){
        dx = 5;
    }
    else{
        dx = dirX;
    }
    
    if (y > h - imgH){
        dy = -5;
    }
    else if (y < 0){
        dy = 5;
    }
    else{
        dy = dirY;
    }
    if (frameCount % 40 > 20){
        if(sprite_snapShot == move2){
            sprite = move1;
        }
        else{
            sprite = move2;
        }
        sprite_snapShot = sprite;
    }
    else{
        sprite = rest;
    }
}

//function keyPressed(){
//    if(keyCode === DOWN_ARROW){
//        
//    }
//}

//function mousePressed(){
//    x = mouseX;
//    y = mouseY;
//}