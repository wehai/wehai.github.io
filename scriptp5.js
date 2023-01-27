let mic, fft, recorder, soundFile;
let state = 0;
var para = document.getElementById("textin");
var t = document.createTextNode("");
var recBtn = document.getElementById("circleRec");
var volhistory = [];
var counter = 0;
var milisecs = 0;
var rectime = 9;
var timer;
var b = 0;
var interval;
var milisecs =0;
var isPaused = false;
var soundvis = [];

var i = 0;

function setup() {
  // create an audio in
  mic = new p5.AudioIn();
  fft = new p5.FFT(0,256);
  

  // prompts user to enable their browser mic
  mic.start();
  getAudioContext().resume();
  // create a sound recorder
  recorder = new p5.SoundRecorder();

  // connect the mic to the recorder
  recorder.setInput(mic);
  fft.setInput(mic);
  // this sound file will be used to
  // playback & save the recording
  soundFile = new p5.SoundFile();
  // Create a <p> element

  t = document.createTextNode("tap to record"); // Create a text node
  para.appendChild(t);

  let cnv = createCanvas(windowWidth*0.8, windowWidth*0.8);
  cnv.parent("recordCanvas");
  background(0, 0, 0, 0);

  angleMode(DEGREES);
}

function draw() {}

function windowResized() {
  resizeCanvas(windowWidth*0.8, windowWidth*0.8,[noRedraw]);
}

function timeIt() { //alle 100 milisecs
  if (isPaused === false) {
    milisecs++;
    var vol = mic.getLevel();
    var spectrum = fft.analyze()
    console.log(spectrum);

    var a = (360 / 90) * milisecs;
    var vol = mic.getLevel();
    volhistory.push(vol);
    stroke(255);
    noFill(255);

    translate(width / 2, height / 2);
    
      var r = map(vol*100, 0, 1, 1, width/2);
      var x = r * cos(a);
      var y = r * sin(a);
    strokeWeight(100*vol);
    stroke(245);
    line(0, 0, x, y);
         stroke(130,r*2,180);
        strokeWeight(4);
        let pointss = point(x, y);
        point(x/0.75, y/0.75);
      soundvis.push(pointss); 
    
     for(var i= 0; i < spectrum.lenght; i++){
     //strokeWeight(0.018 * spectrum[i])
   //  stroke(245 , 132, 255 - spectrum[i], spectrum[i]/40)
    // line(0, i, 0, i)
      var rs = map(spectrum[i], 0, 150, 1, width/2);
      var xs = rs*cos(a)+i;
      var ys = rs*sin(a);
      //point(xs,ys);
    }
  }
  if (Number.isInteger(milisecs / 10)) {
    counter++;
  }
  timer = rectime - counter;
  t.remove();
  para = document.getElementById("textin");
  t = document.createTextNode("00:0" + timer);
  para.appendChild(t);

  if (timer === 0) {
    clearInterval(interval);
    interval = false;
    state = 3;
  }
  if (state === 3) {
    recBtn.style.background = "#000dff";
    recBtn.style["boxShadow"] = "0px 0px 15px 5px #000dff";
    recBtn.style["webkitBoxShadow"] = "0px 0px 15px 5px #000dff";
    // stop recorder an
    // send result to soundFile
    recorder.stop();
    document.getElementById("wrapperw").style.display = "block";
    t.remove();
    para = document.getElementById("textin");
    t = document.createTextNode("Tap to save");
    para.appendChild(t);

    state= 4;
  }
}
function saveBtn() {
  save(soundFile, "mySound.wav");
  state++;
}

function playBtn() {
  soundFile.play();
}
function deleteBtn() {
  soundFile.stop();
  state = 0;
  counter = 0;
  timer = 10;
  milisecs = 0;
  volhistory.length = 0;
   clear();
  //soundvis.remove();
  recBtn.style.background = "#e50000";
  recBtn.style["boxShadow"] = "0px 0px 15px 5px #e50000";
  recBtn.style["webkitBoxShadow"] = "0px 0px 15px 5px #e50000";

  document.getElementById("wrapperw").style.display = "none";

  t.remove();
  para = document.getElementById("textin");
  t = document.createTextNode("Recording!");
  para.appendChild(t);
  state=4;
}

function recBtnClicked() {
  //1st frame
 
  // make sure user enabled the mic
  if (state === 0 && mic.enabled) {
    userStartAudio();
  document.getElementById("background2").style.display = "block";
    // record to our p5.SoundFile
    recorder.record(soundFile);
    if (!interval) {
      interval = setInterval(timeIt, 100);
    }
    document.getElementById("clickingEvent").style.padding = "40vw";
    recBtn.style.padding = "40vw";

    t.remove();
    para = document.getElementById("textin");
    t = document.createTextNode("Recording!");
    para.appendChild(t);
    state = 1;
    //pause
  } else if (state === 1) {
    isPaused = true;
    mic.stop();
    state =2;
    //resume
  } else if (state === 2) {
    isPaused = false;
    mic.start();
    state = 1;
  }else if (state === 4) {
    console.log("another one");
   // mic.start();
     recorder.record(soundFile);
    if (!interval) {
      interval = setInterval(timeIt, 100);
    }
    state = 1;
  }
}
