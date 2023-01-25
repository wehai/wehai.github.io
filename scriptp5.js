let mic, recorder, soundFile;
let state = 0;
var para = document.getElementById("textin");
var t = document.createTextNode("");
var recBtn = document.getElementById("circleRec");
var volhistory = [];
var counter = 0;
var milisecs= 0;
var rectime = 9;
var timer;
var b = 0;
var interval;
var milisec;
var isPaused = false;
function setup() {
 

  // create an audio in
  mic = new p5.AudioIn();

  // prompts user to enable their browser mic
  mic.start();
  getAudioContext().resume();
  // create a sound recorder
  recorder = new p5.SoundRecorder();

  // connect the mic to the recorder
  recorder.setInput(mic);

  // this sound file will be used to
  // playback & save the recording
  soundFile = new p5.SoundFile();
  // Create a <p> element

  t = document.createTextNode("tap to record"); // Create a text node
  para.appendChild(t);
  
   let cnv = createCanvas(300,300);
  cnv.parent("recordCanvas");
  background(0,0,0,0);
  
  angleMode(DEGREES);
}


function draw(){
  
}

function timeIt() {
  if(isPaused === false){
milisecs++;}
   var vol = mic.getLevel();
  console.log(vol*1000);

  
  
  var a = 360/1000 * milisecs;
  var vol = mic.getLevel();
  volhistory.push(vol);
  stroke(255);
  noFill();

  translate(width / 2, height / 2);
  beginShape();
  for (var i = 0; i < 360; i++) {
    var r = volhistory[i]*10500//map(volhistory[i]*100, 0, 1, 1, 100);
    var x = r * cos(i);
    var y = r * sin(i);
    vertex(x, y);
  }
  endShape();
 if (volhistory.length > 360) {
    volhistory.splice(0, 1);
  }
  
  if(Number.isInteger(milisecs / 10)){
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
    recBtn.style["boxShadow"]= "0px 0px 15px 5px #000dff";
    recBtn.style["webkitBoxShadow"]= "0px 0px 15px 5px #000dff";
    // stop recorder an
    // send result to soundFile
    recorder.stop();
    document.getElementById("wrapperw").style.display = "block";
    t.remove();
    para = document.getElementById("textin");
    t = document.createTextNode("Tap to save");
    para.appendChild(t);

    state++;
  }
}
function saveBtn(){
  save(soundFile, "mySound.wav");
    state++;
}

function playBtn(){
  soundFile.play(); 
}
function deleteBtn(){
  soundFile.stop();
  state = 0;
 counter =0;
  timer = 10; 
  milisecs =0;
  volhistory.length= 0;
                      
  recBtn.style.background = "#e50000";
    recBtn.style["boxShadow"]= "0px 0px 15px 5px #e50000";
    recBtn.style["webkitBoxShadow"]= "0px 0px 15px 5px #e50000";
  
  document.getElementById("wrapperw").style.display = "none";
  
    t.remove();
    para = document.getElementById("textin");
    t = document.createTextNode("Recording!");
    para.appendChild(t);
}


function recBtnClicked() {

  //1st frame
  userStartAudio();
 document.getElementById("background2").style.display = "block";
  // make sure user enabled the mic
  if (state === 0 && mic.enabled) {
    // record to our p5.SoundFile
    recorder.record(soundFile);
    if (!interval) {
      interval = setInterval(timeIt, 100);
    }
   document.getElementById("clickingEvent").style.padding= "40vw";
    recBtn.style.padding = "40vw";  

    t.remove();
    para = document.getElementById("textin");
    t = document.createTextNode("Recording!");
    para.appendChild(t);
    state= 1;
  //pause
  } else if (state === 1) {
    isPaused = true;
    //mic.stop();
    state++;
 //resume
  } else if (state === 2) {
    isPaused = false;
    //mic.start();
      state = 1;
  
  }
}
