import processing.pdf.*;

int total = 4;
float [] x = new float[total];
float [] y = new float[total];
float [] noiseX = new float[total];
float [] noiseY = new float[total];
float [] varX = new float[total];
float [] varY = new float[total];

boolean recordOn = false;

void setup() {
  size(1280, 720);
  background(0);
  fillArrays();
}

void draw() {
  background(0);

  if (recordOn) {
    beginRecord(PDF, "point_noise,pdf");
  }
  for (int i = 0; i < total; i++) {
    varX[i] += noiseX[i];
    varY[i] += noiseY[i];
    x[i] = noise(varX[i]) * width;
    y[i] = noise(varY[i]) * height;
    fill(255);
    strokeWeight(random(10));
    stroke(255);
    ellipse(x[i], y[i], 15, 15);
    if (i > 0) {
      connectPoints(i);
    }
  }

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

void fillArrays() {
  for (int i = 0; i < total; i++) {
    x[i] = 0.0;
    y[i] = 0.0;
    noiseX[i] = random(.0001, .0003);
    noiseY[i] = random(.0001, .0003);
    varX[i] = 0.0;
    varY[i] = 0.0;
  }
}

void connectPoints(int i) {
  strokeWeight(2.4);
  stroke(255);
  line(x[i - 1], y[i - 1], x[i], y[i]);
}
