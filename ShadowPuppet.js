let model, video, keypoints, predictions = [];
let gfx;

function preload() {
  video = createCapture(VIDEO, () => {
    loadHandTrackingModel();
  });
  video.hide();
}

function setup() {
  const canvas = createCanvas(600, 400);
  canvas.parent('canvasContainer');
  gfx = createGraphics(600, 400);  // create a graphics buffer

}

async function loadHandTrackingModel() {
  // Load the MediaPipe handpose model.
  model = await handpose.load();
  select('#status').html('Hand Tracking Model Loaded')
  predictHand();
}

function draw() {
  background(260,250,200);
  
  //Mirror video
  translate(width, 0);
  scale(-1,1); //flip -1 scaling so horizontally
  if (predictions.length > 0) {
    drawKeypoints();
    drawSkeleton();
  }
}

async function predictHand() {
  // Pass in a video stream (or an image, canvas, or 3D tensor) to obtain a hand prediction from the MediaPipe graph.
  predictions = await model.estimateHands(video.elt);

  setTimeout(() => predictHand(), 100);
}


// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  let prediction = predictions[0];
  for (let j = 0; j < prediction.landmarks.length; j++) {
    let keypoint = prediction.landmarks[j];
    fill(32, 32, 32);
    strokeWeight(36);
    ellipse(keypoint[0], keypoint[1], 0, 0);
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  let annotations = predictions[0].annotations;
  stroke(32, 32, 32, 180);
  strokeWeight(36);
  for (let j = 0; j < annotations.thumb.length - 1; j++) {
    line(annotations.thumb[j][0], annotations.thumb[j][1], annotations.thumb[j + 1][0], annotations.thumb[j + 1][1]);
  }
  for (let j = 0; j < annotations.indexFinger.length - 1; j++) {
    line(annotations.indexFinger[j][0], annotations.indexFinger[j][1], annotations.indexFinger[j + 1][0], annotations.indexFinger[j + 1][1]);
  }
  for (let j = 0; j < annotations.middleFinger.length - 1; j++) {
    line(annotations.middleFinger[j][0], annotations.middleFinger[j][1], annotations.middleFinger[j + 1][0], annotations.middleFinger[j + 1][1]);
  }
  for (let j = 0; j < annotations.ringFinger.length - 1; j++) {
    line(annotations.ringFinger[j][0], annotations.ringFinger[j][1], annotations.ringFinger[j + 1][0], annotations.ringFinger[j + 1][1]);
  }
  for (let j = 0; j < annotations.pinky.length - 1; j++) {
    line(annotations.pinky[j][0], annotations.pinky[j][1], annotations.pinky[j + 1][0], annotations.pinky[j + 1][1]);
  }

  line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.thumb[0][0], annotations.thumb[0][1]);
  line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.indexFinger[0][0], annotations.indexFinger[0][1]);
  line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.middleFinger[0][0], annotations.middleFinger[0][1]);
  line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.ringFinger[0][0], annotations.ringFinger[0][1]);
  line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.pinky[0][0], annotations.pinky[0][1]);
}