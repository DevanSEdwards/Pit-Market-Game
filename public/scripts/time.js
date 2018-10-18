// Blocks
var lst_blocks = []; // Queue of blocked IDs  // { expire | id }

function shiftBlocks() {
  // Checks if the front of the queue is expired
  // If expired, will unblock the element by ID
  if (lst_blocks.length < 1) { return; }
  var now = Date.now();
  while (1) {
    if (lst_blocks[0][1] >= now) {
      var block = lst_blocks.shift();
      unblockID(block);
    } else { return; }
  } return;
}

// Removes disabled attribute from ID
function unblockID(id) {
  document.getElementById(id).removeAttribute("disabled");
  document.getElementById(id).classList.remove("disabled");
}

// Add's disabled attribute to ID and adds to queue
function blockID(id, time) {
  var t = Date.now();
  var e = t + (time * 1000);

  lst_blocks.push([time, id]);
  document.getElementById(id).setAttribute("disabled", true);
  document.getElementById(id).classList.remove("disabled");
  // TODO: Fix this
}

/* Timer Functions */

function endOfTimer() { return; }

// ToString() wrappers
function secondsToString(s) {
  var ret = s2m(s);
  return String(ret[0]) + ":" + String(ret[1]);
}

function minutesToString(m, s) { return (String(m) + ":" + String(s)); }

// Conerts seconds to minutes
function s2m(t) {
  var m = parseInt(t / 60); var s = t % 60;
  min = `${m < 10 ? `0` : ``}${m}`;
  sec = `${s < 10 ? `0` : ``}${s}`;
  return [min, sec];
}
// Convert Minutes to seconds
function m2s(m, s) { return (m * 60) + s; }

// set timer constant to time (in seconds)
function setTimer_s(t) {
  state.roundTimer = t;
  setTimerDisplay("info_roundCounter", secondsToString(state.roundTimer));
}
// set timer constant to time (in minutes,seconds)
function setTimer_ms(m, s) {
  state.roundTimer = m2s(m, s);
  setTimerDisplay("info_roundCounter", secondsToString(state.roundTimer));
}

// Sets the element to the time
function setTimerDisplay(element, t) { document.getElementById(element).innerHTML = `<span>Time: </span>${t}`; }

// 
function incrementTimer() { // Increment timer
  if (state.inRound && state.roundTimer > 0) // Don't go negative
      setTimerDisplay("info_roundCounter", secondsToString(--state.roundTimer));
}