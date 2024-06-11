
dropdownOpen = false;
var lastNav;
let draggables = document.querySelectorAll(".result");

// Loop over the collection
draggables.forEach(function(elmnt){
  dragElement(elmnt);
});

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;
  

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

document.addEventListener('DOMContentLoaded', (event) => {
  document.querySelectorAll('.dropdown').forEach(dropdown => {
      const button = dropdown.querySelector('.dropbtn');
      const content = dropdown.querySelector('.dropdown-content');

      button.addEventListener('click', (event) => {
        
        // If we're pressing another dropbox while is open hide the open one.
        if (event.target.matches('.dropbtn') && dropdownOpen == true) {
          lastNav.classList.toggle('show');
          dropdownOpen = false;
        }
        
        lastNav = content;
        dropdownOpen = true;
        content.classList.toggle('show');
      });
  });

  // Close the dropdown if the user clicks outside of it
  window.addEventListener('click', (event) => {
      if (!event.target.matches('.dropbtn') && !event.target.matches('.criteriaElement')) {
          document.querySelectorAll('.dropdown-content').forEach(content => {
              if (content.classList.contains('show')) {
                dropdownOpen = false;
                content.classList.toggle('show');
              }
          });
      }
  });
});


// function filterFunction() {
//   var input, filter, ul, li, a, i;
//   input = document.getElementById("myInput");
//   filter = input.value.toUpperCase();
//   div = document.getElementById("myDropdown");
//   a = div.getElementsByTagName("a");
//   for (i = 0; i < a.length; i++) {
//     txtValue = a[i].textContent || a[i].innerText;
//     if (txtValue.toUpperCase().indexOf(filter) > -1) {
//       a[i].style.display = "";
//     } else {
//       a[i].style.display = "none";
//     }
//   }
// }