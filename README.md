# Chrome Chess Bot

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/lohcfjmdomblangndimbjfecoapohjlb.svg?maxAge=2592000)]()
[![Chrome Web Store](https://img.shields.io/chrome-web-store/d/lohcfjmdomblangndimbjfecoapohjlb.svg?maxAge=2592000)]()

A chess bot for [Chess.com](https://chess.com) written in Javascript and designed as a Chrome extension. Uses the open-source [Stockfish](https://stockfishchess.org/) engine for its move analysis. Automatically registers game start/completion, parses game state on a per-move basis, and produces the best move after analyzing outcomes 14 moves deep. 

> 14 is default, this can be changed in ``background.js`` to sacrifice move calculation speed for better performance.

> A search limit of 14 takes ~0.75-1 second per move.

> Warning: increasing max search depth will exponentially increase computation time.

Tested (to win) on defaults settings up to ~2000 Elo.

![gif1](https://i.gyazo.com/b23c10494b89b913e72e2371ab3b24b4.gif)

Download from the [Chrome Web Store](https://chrome.google.com/webstore/detail/chess-bot/lohcfjmdomblangndimbjfecoapohjlb), or add it as a local extension by cloning the repo and visiting chrome://extensions.

##### Warning: Extensive use of this bot will likely result in account closure. Use at your own risk.

### How Does It Work?
This Chrome extension contains 3 main components: a background script running the bulk of my logic ``background.js``, a content script ``bot.js``, and another script injected into the webpage ``inject.js``.

The injected script adds an event listener to the page's XMLHttpRequest object, that intercepts any messages sent by the chess.com server to the client. It then parses any requests indicating a played move sent by the server and routes it to the content script. The content script acts as a message controller / relay, listening for any messages from the injected script or background script and relaying it to the appropriate handler. My background script is running a variation of the Stockfish engine in a web worker, and contains a Chrome runtime listener for any messages sent by the content script. Once a new move has been received, it runs through my handling logic and spits out the best move to the content script, which then displays it on the page.

### TODO
* Automatic move completion (difficult due to chess.com obfuscation)
* Bugs:
  * Event listener sometimes doesn't catch the HTTP response containing the move.
  * Non-Queen promotions don't work properly.
  * Tile highlighting scaling breaks when browser window is resized mid-game.
