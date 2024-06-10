
let draggables = document.querySelectorAll(".result");

// Loop over the collection
draggables.forEach(function(elmnt){
  dragElement(elmnt);
});

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    elmnt.style.position = "absolute";
    elmnt.id = "div1";
    e = e || window.event;
    e.preventDefault();
    elmnt.style.top = e.clientY - 250 + "px";
    elmnt.style.left = e.clientX - 125 + "px";
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
    // Keep its spot in the flexbox.
    placeholder = document.createElement('div');
    placeholder.className = "placeholder";
    gallery = document.getElementById("resultBox");
    gallery.insertBefore(placeholder, elmnt);
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement(e) {
    // stop moving when mouse button is released:
    if (pos4 = e.clientY > screen.height*.8) {
        console.log("BURN!!");
        elmnt.remove();
        placeholder.remove();
    } else if (pos4 = e.clientY < screen.height*.1) {
        console.log("save!!");
        elmnt.remove();
        placeholder.remove();
    } else {
        placeholder.remove();
        elmnt.id = "resulty";
        elmnt.style.top = "0px";
        elmnt.style.left ="0px";
        elmnt.style.position = "relative";
    }
    document.onmouseup = null;
    document.onmousemove = null;
  }
}