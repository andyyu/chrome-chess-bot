window.addEventListener('message', function(event) {
    if (event.data.type !== 'make_move') {
      return;
    }
    console.log('page javascript got message:', event.data.text);
});

/**
board = driver.find_element_by_class_name("boardDummy")
  board_element_1 = board.find_element_by_class_name("bs")
  board_element_2 = board_element_1.find_element_by_class_name("boardBottomPlayer")
  color_element = board_element_2.find_element_by_xpath("//input[contains(@id, '_timer_dummy')]")
  color = color_element.get_attribute("id")[:5]
  if (color == "black"):
    player_color = 1
    **/

(function() {
  'use strict';
  var oldXHR, stateChangeHandler, prop;

  oldXHR = window.XMLHttpRequest;
  stateChangeHandler = function (evt) {
    switch (this.readyState) {
      case oldXHR.DONE:
        if(this.responseURL === 'http://live.chess.com/cometd/connect' || this.responseURL === 'https://live.chess.com/cometd/connect'){
          handleMove(this.response);
        }
        break;
    }
  };
 
  function newXHR() {
    var xhr = new oldXHR();
    xhr.addEventListener('readystatechange', stateChangeHandler);
    return xhr;
  }
 
  // Copy original states and toString
  for (prop in oldXHR)
    newXHR[prop] = oldXHR[prop];
 
  window.XMLHttpRequest = newXHR;
})();

function handleMove(json) {
  var obj = JSON.parse(json);
  if (obj[0].hasOwnProperty('data') && obj[0].data.hasOwnProperty('game') && obj[0].data.game.hasOwnProperty('status')) {
    var gameStatus = obj[0].data.game.status;
    if (gameStatus === 'starting' || gameStatus === 'finished')
      window.postMessage({ type: 'game_stat', test: gameStatus}, '*');
  }
  if (obj[0].channel.match(/\/game\/*/)) {
    if (obj[0].data.tid === "GameState") {
      var moveString = obj[0].data.game.moves;
      var uciString = stringToUCI(moveString);
      window.postMessage({ type: 'made_move',
                         text: uciString},
                       '*');
    }
  }
}

function stringToUCI(moveString) {
  var uciString = "";
  moveMap = {"a": "a1","i": "a2","q": "a3","y": "a4","G": "a5","O": "a6","W": "a7","4": "a8","b": "b1","j": "b2","r": "b3","z": "b4","H": "b5","P": "b6","X": "b7","5": "b8","c": "c1","k": "c2","s": "c3","A": "c4","I": "c5","Q": "c6","Y": "c7","6": "c8","d": "d1","l": "d2","t": "d3","B": "d4","J": "d5","R": "d6","Z": "d7","7": "d8","e": "e1","m": "e2","u": "e3","C": "e4","K": "e5","S": "e6","0": "e7","8": "e8","f": "f1","n": "f2","v": "f3","D": "f4","L": "f5","T": "f6","1": "f7","9": "f8","g": "g1","o": "g2","w": "g3","E": "g4","M": "g5","U": "g6","2": "g7","!": "g8","h": "h1","p": "h2","x": "h3","F": "h4","N": "h5","V": "h6","3": "h7","?": "h8"};
  for(var i = 0; i < moveString.length; i+=2) {
    var from = moveMap[moveString[i]];
    var to = moveMap[moveString[i+1]];
    uciString += from + to;
  }
  return uciString;
}
