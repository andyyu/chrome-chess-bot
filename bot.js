loadScript('inject.js', function(){
  console.log('loaded inject.js');
});
loadScript('simulatemouseclick.js', function(){
  console.log('loaded simulatemouseclick.js');
})
// inject move sniffer

chrome.runtime.onMessage.addListener(function(results) {  // extension -> content-script listener
  if (results.type === 'make_move') {
    console.log("received stockfish move: " + results.text)
    /**
    var squareOne = results.text.slice(0,2);
    var squareTwo = results.text.slice(2,4);
    var injectCode = ['MOUSECLICK.init(["' + squareOne + '", "' + squareTwo + '"]);',
                      'MOUSECLICK.click();'].join('\n');
    var script = document.createElement('script');
    script.textContent = injectCode;
    (document.head||document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);
    **/
  }
});

window.addEventListener('message', function(event) {  // inject.js -> content-script listener
  if (event.data.type === 'game_stat') {
    var game_stat = (event.data.text === 'starting') ? true : false;
    chrome.runtime.sendMessage({ type: 'game_stat', text: game_stat },
                              function(response) {
                                });
    console.log("started or ended game");
  }
  if (event.source !== window || event.data.type !== 'made_move') {  // only messages from same frame
    return;
  }
  var message = event.data.text;
  console.log("received move:" + message)
  chrome.runtime.sendMessage({ type: 'made_move', text: message },
                              function(response) {
                                  //console.log(response.text);
                                });  
  console.log("sent move to extension");
  //send it to background.js
});

function loadScript(scriptName, callback) {
    var script = document.createElement('script');
    script.src = chrome.extension.getURL(scriptName);
    script.addEventListener('load', callback, false);
    (document.head || document.documentElement).appendChild(script);
}