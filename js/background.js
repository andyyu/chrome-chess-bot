var stockfish = new Worker(chrome.extension.getURL('js/stockfish.js'));
var tabId = null;  // tab id of the received message
var game_start = false;
var turn_number = 0;

stockfish.onmessage = function(event) { 
    flag = true;
    response = event.data;
    parseMove(response);
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {  // callback function not used in favor of async, tab specific response
    tabId = sender.tab.id;
    var input = '';
    if (request.type === 'game_stat') {
      game_start = request.text;
      console.log('game status change');
    }
    if (request.type !== 'made_move' || game_start === false) {
      return;
    }
    for (var i = 0; i < request.text.length; i++) {
      input += request.text[i];
      if ((i - 3) % 4 == 0) {
        input += ' ';
      }
    }
    console.log(input);
    stockfish.postMessage('position startpos moves ' + input);
    stockfish.postMessage('go depth 15');
    return true;
});

function sendMessage(tab, data) {
  if (tab && data) {
    chrome.tabs.sendMessage(tab, data);
  }
}

function parseMove(uciMove) {
  if (uciMove.indexOf('bestmove') > -1) {
    var move = uciMove.slice(9, uciMove.indexOf('ponder')-1);
    sendMessage(tabId, {type: 'make_move', text: move});
    //var response = uciMove['bestmove'];
    //sendMessage(tabId, {type: 'make_move', text: response});
  }
}