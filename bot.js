var s = document.createElement('script');
s.src = chrome.extension.getURL('inject.js');
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(s);

var currentList = [];
var stockfish = new Worker('stockfish.js');

setTimeout(function() {
    stockfish.postMessage('position fen 8/5pkp/1p6/p7/P3p1B1/4p2P/5qPK/1R6 b - - 1 46');
    stockfish.postMessage('go depth 19');
}, 2000);

stockfish.onmessage = function(event) { 
    var s = document.createElement('script');
    s.src = chrome.extension.getURL('test.js');
    s.onload = function() {
       this.parentNode.removeChild(this);
    };
    (document.head || document.documentElement).appendChild(s);
};

window.addEventListener('message', function(event) {
  // Only accept messages from same frame
  /**
  if (event.source !== window) {
    return;
  }
**/
  var message = event.data;
/**
  // Only accept messages that we know are ours
  if (typeof message !== 'object' || message === null || !message.hello) {
    return;
  }
  **/
  stockfish.postMessage('position startpos moves ' + message);
  stockfish.postMessage('go depth 19');
});