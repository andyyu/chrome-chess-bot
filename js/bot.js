loadScript('js/inject.js', function(){
  console.log('loaded inject.js');
});

var container;
var boardArea;
var boardName;
var fromTile;
var toTile;
var tileHeight;
var tileWidth;

var answer = document.createElement("div");
answer.id = "move_suggest_box";
answer.style.cssText = "position:relative; left: 20px;width: 225px;border: solid 2px #2F4F4F;height: 26px;background: #FFFFFF;font-family: 'Tahoma', Geneva, sans-serif;font-size: 16px;color: #0C090A;padding-left: 10px;"; 
var findBoard = setTimeout(function appendAnswerBox() {
  var element = document.getElementsByClassName("boardContainer");
  for (var i = 0; i < element.length; i++) {
    console.log(element[i].id);
    if (!isNaN(element[i].id.slice(-1))) {
      container = element[i];
      container.appendChild(answer);
      boardArea = container.getElementsByClassName("chess_viewer")[0].children[0];
      boardName = boardArea.id.slice(0, -10);
      console.log(boardArea);
      tileHeight = boardArea.children[0].style.height;
      tileWidth = boardArea.children[0].style.width;

      console.log(tileHeight);
      console.log(tileWidth);
      clearTimeout(findBoard);
    }
  }
}, 1000);
answer.innerHTML = "Start game to continue.";


/**
loadScript('js/simulatemouseclick.js', function(){
  console.log('loaded simulatemouseclick.js');
})
**/
// inject move sniffer
chrome.runtime.onMessage.addListener(function(results) {  // extension -> content-script listener
  if (results.type === 'make_move') {
    if (fromTile !== undefined && fromTile !== null) {
      fromTile.style.background = null;  
    }
    if (toTile !== undefined && toTile !== null) {
      toTile.parentElement.removeChild(toTile); 
    }
    answer.innerHTML = "Best move: " + results.text;
    /** Make tiles highlighted **/
    var coord1 = results.text.slice(0,2);
    var coord2 = results.text.slice(2,4);
    var tileList = boardArea.children;
    var endTop;
    var endLeft;
    console.log(coord2.slice(-1));
    console.log((coord2.slice(0,1).charCodeAt(0) - 97).toString());
    for (var i = 0; i < tileList.length; i++) {
      if (tileList[i].id.slice(-2) === coord1) {
        fromTile = tileList[i];
      }
      if (tileList[i].id.slice(0,5) === "digit" && tileList[i].innerHTML === coord2.slice(-1)) {
        endTop = tileList[i].style.top;
      }
      if (tileList[i].id.slice(0,6) === "letter" && tileList[i].innerHTML === coord2.slice(0,1)) {
        endLeft = tileList[i].style.left;
      }
    }
    console.log(endTop);
    console.log(endLeft);
    toTile = document.createElement("img");
    toTile.id = fromTile.id.slice(0,-2) + coord2;
    toTile.className = fromTile.className;
    toTile.style.cssText = "position: absolute; top: " + endTop + "; left: " + endLeft + "; margin: 0px; padding: 0px; display: block; width: " + tileHeight + "; height: " + tileWidth + "; z-index: 9; transform: translateZ(0px); cursor: pointer; background: rgb(216, 72, 64);";
    toTile.src = fromTile.src;
    boardArea.appendChild(toTile);

    toTile.style.cssText += "; background: #007f00";
    toTile.style.zIndex = 1;
    fromTile.style.cssText += "; background: #d84840";

    /** End tile highlighting **/
    
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
    answer.innerHTML = "...";

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