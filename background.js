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
chrome.extension.onMessage.addListener(function(message, sender, n) {
    console.log("received message" + message.data.text);
    var tabId = sender.tab.id;
    if (message.data.type !== 'made_move') {
      return;
    }
    stockfish.postMessage('position startpos moves ' + message.data.text);
    stockfish.postMessage('go depth 15');
    while (!flag) {
    }
    sendMessage(tabID, response);
    response = '';
    flag = false;
});

function sendMessage(tab, data) {
  if (tab && data) {
    chrome.tabs.sendMessage(tab, data);
  }
}