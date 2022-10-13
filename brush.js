//console.log("hello!");

function setup() {
//    var vvg = createCanvas(495, 390);
//    background(color('#719382'));
    var fal = createCanvas(495, 390);
    background(0);
}

let value = 0;

//function draw() {
////    rect(mouseX, mouseY, 30, 30);
////    noStroke();
//}

let thick = 2.5;
let rectW = 100;
let rectH = 300;
let posX = 197.5;
let posY = 45;
let posX1 = 147.5;
let posY1 = 145;
let thick1 = 2.5;
let rectW1 = 200;
let rectH1 = 100;

function mousePressed() {
//    fill(255);
//    text("*", mouseX, mouseY);
    noFill();
    if (mouseButton === LEFT){
        stroke('rgba(223, 137, 233, 0.6)');
        thick = thick - 0.2;
        strokeWeight(thick);
        posX = posX + 2.5;
        posY = posY + 2.5;
        rectW = rectW - 5;
        rectH = rectH - 5;
        rect(posX, posY, rectW, rectH);
    }
    
    if (mouseButton === CENTER){
        stroke('rgba(252, 235, 254, 0.6)');
        thick1 = thick1 - 0.4;
        strokeWeight(thick1);
        posX1 = posX1 + 7.5;
        posY1 = posY1 + 7.5;
        rectW1 = rectW1 - 15;
        rectH1 = rectH1 - 15;
        rect(posX1, posY1, rectW1, rectH1);
    }
}

function mouseDragged(){
    fill(value);
    rect(mouseX, mouseY, 10, 10);
    noStroke();
}

function keyTyped(){
    if (key === 'z'){
        value = color('#d8d4a4');
    }
    else if (key === 'x'){
        value = color('#8c6f29');
    }
    else if (key === 'c'){
        value = color('#3b657d');
    }
    else if (key === 'v'){
        value = color('#719382');
    }
    else if (key === 'r'){
        thick = 2.5;
        let rectW = 100;
        let rectH = 300;
    }
//    else if (key === 's'){
//        saveCanvas(vgg, 'CA_vanGogh', 'jpg');
//    }
}

function keyPressed(){
    if (keyCode === SHIFT){
        posX = posX + 2.5;
        posY = posY + 2.5;
        rectH = rectH - 5;
        rectW = rectW - 5;
    }
    else if (keyCode === DOWN_ARROW){
        noFill();
        stroke('rgba(0, 255, 255, 0.8)');
        thick = thick - 0.25;
        strokeWeight(thick + 2);
//        posX = posX + 2.5;
//        posY = posY + 2.5;
        rectW = rectW - 10;
        rectH = rectH - 10;
        rect(mouseX, mouseY, rectW, rectH);
    }
    else if (keyCode === UP_ARROW){
        noFill();
        stroke('rgba(204, 16, 82, 0.8)');
        thick = thick - 0.25;
        strokeWeight(thick + 2);
//        posX = posX + 2.5;
//        posY = posY + 2.5;
        rectW = rectW - 10;
        rectH = rectH - 10;
        rect(mouseX, mouseY, rectW, rectH);
    }
}