let video;
let poseNet;
let pose;
let skeleton;

let brain;
let poseLabel = "";

let state = 'waiting';
let targetLabel;
function keyPressed() {
    if (key == 't') {
      brain.normalizeData();
      brain.train({epochs: 50}, finished); 
    } else if (key == 's') {
      brain.saveData();
    } else {
      targetLabel = key;
      console.log(targetLabel);
      setTimeout(function() {
        console.log('collecting');
        state = 'collecting';
        setTimeout(function() {
          console.log('not collecting');
          state = 'waiting';
        }, 2000);
      }, 1000);
    }
  }

  function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.hide();
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);
  
    let options = {
      inputs: 34,
      outputs: 4,
      task: 'classification',
      debug: true
    }
    brain = ml5.neuralNetwork(options);
  }
  function finished() {
    console.log('model trained');
    brain.save();
    classifyPose();
  }
  
  function gotPoses(poses) {
    // console.log(poses); 
    if (poses.length > 0) {
      pose = poses[0].pose;
      skeleton = poses[0].skeleton;
      if (state == 'collecting') {
        let inputs = [];
        for (let i = 0; i < pose.keypoints.length; i++) {
          let x = pose.keypoints[i].position.x;
          let y = pose.keypoints[i].position.y;
          inputs.push(x);
          inputs.push(y);
        }
        let target = [targetLabel];
        brain.addData(inputs, target);
      }
    }
  }

