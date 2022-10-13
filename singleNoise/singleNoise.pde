import processing.pdf.*;

float x = 0.0;
float y = 0.0;
float noiseX = .00005;
float noiseY = .003;
float varX = 0.0;
float varY = 0.0;

boolean recordOn = false;

void setup() {
   size(1280, 720);
   background(0);
}

void draw() {
  background(0);
  
  if (recordOn) {
    beginRecord(PDF, "point_noise,pdf");
  }
  
  varX += noiseX;
  varY += noiseY;
  x = noise(varX) * width;
  y = noise(varY) * height;
  fill(255);
  strokeWeight(random(10));
  stroke(255);
  ellipse(x, y, 15, 15);
  
  if (recordOn) {
    endRecord();
    recordOn = false;
  }
}

void keyPressed() {
 if (!recordOn) {
   recordOn = true;
 }
 //else if (recordOn) {
 //  recordOn = false;
 //}
}
