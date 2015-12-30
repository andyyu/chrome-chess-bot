var blah = setInterval(function(){
    var draw = document.getElementsByClassName('drawResignButtons');
    if (draw.length == 2) {
      var classname = draw[1].getAttribute('class');
      if (classname.indexOf('hidden') == -1) { 
        window.alert("game started!")
        clearInterval(blah);
      }
    }
  }, 50);