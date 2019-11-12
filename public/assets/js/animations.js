/*Javascript animations-------------------------------------------------------------*/

/*FRONT PAGE ANIMATIONS---------------*/

const totalFrames = 9;
const animationDuration = 1500;
const timePerFrame = animationDuration / totalFrames;
let timeWhenLastUpdate;
let timeFromLastUpdate;
let frameNumber = 1;

// 'step' function will be called each time browser rerender the content
// we achieve that by passing 'step' as a parameter to 'requestAnimationFrame' function
function step(startTime) {
  // 'startTime' is provided by requestAnimationName function, and we can consider it as current time
  // first of all we calculate how much time has passed from the last time when frame was update
  if (!timeWhenLastUpdate) timeWhenLastUpdate = startTime;
  timeFromLastUpdate = startTime - timeWhenLastUpdate;

  // then we check if it is time to update the frame
  if (timeFromLastUpdate > timePerFrame) {
    // hide all frames
    getElementById("MyID").style.opacity(0);
    // and show the required one
    getElementById(`MyID-${frameNumber}`).style.opacity(1);
    // reset the last update time
    timeWhenLastUpdate = startTime;

    // then increase the frame number or reset it if it is the last frame
    if (frameNumber >= totalFrames) {
     
/*FRONT PAGE ANIMATIONS---------------*/















/*Mouse over function*/
mouseOver = () => {
    document.getElementById.height = element.height * 2;
    document.getElementById.width = element.width * 2;
    }

/*Mouse out function*/
mouseOut = () => {
    document.getElementById.height = element.height/2;
    document.getElementById.width = element.width/2;
    }

/*Mouse function calls*/
document.getElementById("demo").addEventListener("mouseover", mouseOver);
document.getElementById("demo").addEventListener("mouseout", mouseOut);

