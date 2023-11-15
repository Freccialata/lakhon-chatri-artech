let img;
let song, analyzer, fft;
let globalArc = 0;
let cyclingCircles = [];

function preload() {
  img = loadImage('media/bg.jpg');
  song = loadSound('media/lakchatri.mp3');
  fft = new p5.FFT();
}

function setup() {
  const avoid_overflowing = 4;
  createCanvas(2560 - avoid_overflowing, 1600 - avoid_overflowing); // MAIN installation sreen
  // createCanvas(1080, 720); // test screen
  song.loop();
  analyzer = new p5.Amplitude();
  analyzer.setInput(song);

  const circleColors = [
    color(122, 260, 180),
    color(110, 80, 253),
    color(250, 250, 100),
    color(220, 90, 120)
  ]

  for (let i = 0; i < circleColors.length; i++) {
    cyclingCircles.push(new RotoCircle(
      width / 2, height / 2, random(2, 5), random(5, 8), random(15, 60),
      circleColors[i],
      i % 2
    ));
  }
}

function draw() {
  background(img);
  // bgColorFilter();

  let waveform = fft.waveform();
  waveLines(waveform);

  let rms = analyzer.getLevel();
  rmsCircles(rms);

  for (let i = 0; i < cyclingCircles.length; i++) {
    cyclingCircles[i].show();
    cyclingCircles[i].update();
  }

  globalArc += .01;
}

const bgColorFilter = () => {
  const alpha = 200;
  // const blue1 = color(18, 5, 63, alpha);
  // const blue2 = color(18, 7, 89, alpha);
  const violet = color(80, 75, 242, alpha);
  const pink = color(177, 79, 242, alpha);

  let sinval = (1 + sin(globalArc)) / 2;

  col = lerpColor(pink, violet, sinval);

  ellipse(width / 2, height / 2, sinval * 100, sinval * 100);
  fill(col);
  noStroke();
  rect(0, 0, width, height);
}

const waveLines = (waveform) => {
  stroke(242, 119, 75, 200);
  noFill();
  beginShape();
  strokeWeight(5);
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, height, 0);
    vertex(x, y);
  }
  endShape();
}

const rmsCircles = (rms) => {
  noFill();
  stroke(242, 119, 75, 200);
  const multipl = 1000;
  ellipse(0, 0, 10 + rms * multipl, 10 + rms * multipl);
  ellipse(width, 0, 10 + rms * multipl, 10 + rms * multipl);
  ellipse(0, height, 10 + rms * multipl, 10 + rms * multipl);
  ellipse(width, height, 10 + rms * multipl, 10 + rms * multipl);
}

class Particle {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.history = [];
  }

  update() {
    this.x = this.x + random(-5, 5);
    this.y = this.y + random(-5, 5);

    let v = createVector(this.x, this.y);

    this.history.push(v);
    //console.log(this.history.length);

    if (this.history.length > 100) {
      this.history.splice(0, 1);
    }
  }

  show() {
    stroke(255);
    beginShape();
    for (let i = 0; i < this.history.length; i++) {
      let pos = this.history[i];
      noFill();
      vertex(pos.x, pos.y);
      endShape();
    }

    noStroke();
    fill(200);
    ellipse(this.x, this.y, 24, 24);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
