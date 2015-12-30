var s = document.createElement('script');
s.src = chrome.extension.getURL('inject.js');
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(s);
// inject move sniffer

chrome.extension.onMessage.addListener(function(results) {  // extension -> content-script listener
  if (results.type === 'made_move') {
    console.log("received stockfish move: " + results.text)
    // make move by injecting click
  }
});

window.addEventListener('message', function(event) {  // inject.js -> content-script listener
  if (event.source !== window || event.data.type !== 'made_move') {  // only messages from same frame
    return;
  }
  var message = event.data.text;
  console.log("received move:" + message)
  chrome.extension.sendMessage(message,
                                 false);  // false can be replaced w/ function, but explicit responses are better and are used here
  console.log("sent move to extension");
  //send it to background.js
});

/**
chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
      console.log(response.farewell);
});
and in my background script, I am doing

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
          "from a content script:" + sender.tab.url :
          "from the extension");
        if (request.greeting == "hello")
            sendResponse({farewell: "goodbye"});
    }
);
**/