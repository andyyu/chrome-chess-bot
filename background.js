var stockfish = new Worker(chrome.extension.getURL('stockfish.js'));
var response = '';
var flag = false;
/**
setTimeout(function() {
    stockfish.postMessage('position fen 8/5pkp/1p6/p7/P3p1B1/4p2P/5qPK/1R6 b - - 1 46');
    stockfish.postMessage('go depth 19');
}, 2000);
**/
stockfish.onmessage = function(event) { 
    flag = true;
    response = event.data;
};
console.log("hello am i working");
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("received message" + request.text);
    var tabId = sender.tab.id;
    if (request.type !== 'made_move') {
      return;
    }
    stockfish.postMessage('position startpos moves ' + request.text);
    stockfish.postMessage('go depth 15');
    while (!flag) {
    }
    sendResponse({text: response});
    response = '';
    flag = false;
    return true;
});

function sendMessage(tab, data) {
  if (tab && data) {
    chrome.tabs.sendMessage(tab, data);
  }
}