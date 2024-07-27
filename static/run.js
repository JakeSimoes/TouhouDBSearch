dropdownOpen = false;
// Stores the last open navigation bar. Allows us to close it.
var lastNav;

// Info for album selection
let page = 0;
let draggables = document.querySelectorAll(".result");
let genres = new Map();
let OSTs = new Map();
let circles = new Map();
let artists = new Map();


// // Loop over the collection
// draggables.forEach(function(elmnt){
//   dragElement(elmnt);
// });

// function dragElement(elmnt) {
//   var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
//   elmnt.onmousedown = dragMouseDown;


//   function dragMouseDown(e) {
//     elmnt.style.position = "absolute";
//     elmnt.id = "div1";
//     e = e || window.event;
//     e.preventDefault();
//     elmnt.style.top = e.clientY - 250 + "px";
//     elmnt.style.left = e.clientX - 125 + "px";
//     // get the mouse cursor position at startup:
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     document.onmouseup = closeDragElement;
//     // call a function whenever the cursor moves:
//     document.onmousemove = elementDrag;
//     // Keep its spot in the flexbox.
//     placeholder = document.createElement('div');
//     placeholder.className = "placeholder";
//     gallery = document.getElementById("resultBox");
//     gallery.insertBefore(placeholder, elmnt);
//   }

//   function elementDrag(e) {
//     e = e || window.event;
//     e.preventDefault();
//     // calculate the new cursor position:
//     pos1 = pos3 - e.clientX;
//     pos2 = pos4 - e.clientY;
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     // set the element's new position:
//     elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
//     elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
//   }

//   function closeDragElement(e) {
//     // stop moving when mouse button is released:
//     if (pos4 = e.clientY > screen.height*.8) {
//         console.log("BURN!!");
//         elmnt.remove();
//         placeholder.remove();
//     } else if (pos4 = e.clientY < screen.height*.1) {
//         console.log("save!!");
//         elmnt.remove();
//         placeholder.remove();
//     } else {
//         placeholder.remove();
//         elmnt.id = "resulty";
//         elmnt.style.top = "0px";
//         elmnt.style.left ="0px";
//         elmnt.style.position = "relative";
//     }
//     document.onmouseup = null;
//     document.onmousemove = null;
//   }
// }

document.addEventListener('DOMContentLoaded', (event) => {
    overlay = document.getElementById('overlay');
    closeOverlay = document.getElementById('closeOverlay');
    albumName = document.getElementById('albumName');
    albumInfo = document.getElementById('albumInfo');
    tracksInfo = document.getElementById('tracksInfo');

    closeOverlay.addEventListener("click", function() {
        overlay.classList.remove("show2");
    });

    document.querySelectorAll('.dropdown').forEach(dropdown => {
        // We need to select every button and their respective dropdown div.
        const button = dropdown.querySelector('.dropbtn');
        const content = dropdown.querySelector('.dropdown-content');

        // This eventlistener is basically just assigning a function when the user clicks.
        button.addEventListener('click', (event) => {
            // If we press another dropbox when another is open hide it.
            if (event.target.matches('.dropbtn') && dropdownOpen == true) {
                lastNav.classList.toggle('show');
                dropdownOpen = false;
            }

            lastNav = content;
            dropdownOpen = true;

            if ($(content).children("input").attr("id") != "name") {
                $(content).children("input").val("");
            }
            $(content).children("div").empty();
            initCriteria($(content).children("input").attr("id"))
            content.classList.toggle('show');
        });
    });


    window.addEventListener('click', (event) => {

        if (event.target.parentElement.matches('.result')) {
            getAlbumInfo(event.target.parentElement.id);

        }

        if (event.target.matches('.criteriaButton')) {
            let parent = event.target.parentElement.id;
            var selection;
            // Figure out which button was pressed.
            if (parent == "results") {
                selection = genres;
            } else if (parent == "results2") {
                selection = OSTs;
            } else if (parent == "results3") {
                selection = circles;
            } else if (parent == "results4") {
                selection = artists;
            }

            // Toggles a criteria button by changing colors and adding/removing to a set.
            if (selection.has(event.target.id)) {
                selection.delete(event.target.id);
                event.target.style.backgroundColor = "White";
                event.target.style.color = "Black";
            } else {
                selection.set(event.target.id, event.target.textContent)
                event.target.style.color = "White";
                event.target.style.backgroundColor = "#fe0000ff";
            }

            getAlbums(0);
        }

        // Close the dropdown if the user clicks outside of it
        if (!event.target.matches('.dropbtn') && !event.target.matches('.criteriaElement') && !event.target.matches('.criteriaButton')) {
            document.querySelectorAll('.dropdown-content').forEach(content => {
                if (content.classList.contains('show')) {
                    dropdownOpen = false;
                    content.classList.toggle('show');
                }
            });
        }
    });

    const scrollableDiv = document.getElementById('resultBox');

    scrollableDiv.addEventListener('scroll', () => {
        // Checks if we need more content.
        // The distance scrolled + the height of the visible div >= the height of the entire div (including non-visible parts)
        if (scrollableDiv.scrollTop + scrollableDiv.clientHeight + 10 >= scrollableDiv.scrollHeight) {
            page += 1;
            getAlbums(page);
        }
    });
});

function getAlbumInfo(id) {
    $.get('/albumInfo', {
        id: id
    }, function(data) {
        // album name data[0]['album']
        // genres data[0]['genres']
        // circle data[0]['circle']
        albumName.innerHTML = data[0]['album'];
        albumInfo.innerHTML = "<li>Circle: " + data[0]['circle'] + "</li> " + "<li>Genres: " + data[0]['genres'] + "</li>";

        $('#tracksInfo').empty();
        num = 1;
        data[1].forEach(track => tracksInfo.innerHTML += "<li>" + num++ + ". " + track + "</li>");

        overlay.classList.add('show2');
    });
}

function getAlbums(page) {
    $.get('/getAlbums', {
        genres: JSON.stringify(Array.from(genres.keys())),
        OSTs: JSON.stringify(Array.from(OSTs.keys())),
        circles: JSON.stringify(Array.from(circles.keys())),
        artists: JSON.stringify(Array.from(artists.keys())),
        songName: $('#name').val().trim(),
        page: page
    }, function(data) {
        if (page == 0) {
            $('#resultBox').empty();
        }
        if (data) {
            data.forEach(function(item) {
                $('#resultBox').append("<div class=\"result\" id='" + item.id + "'> <img src=\"/static/img.jpg\"></img> <h3>" + item.name + "</h3></div>");
            });
        }
    });
}

function initCriteria(criteraID) {
    var selection;
    switch (criteraID) {
        case "genre":
            selection = genres;
            criteriaDiv = $('#results');
            break;
        case "ost":
            selection = OSTs;
            criteriaDiv = $('#results2');
            break;
        case "circle":
            selection = circles;
            criteriaDiv = $('#results3');
            break;
        case "artist":
            selection = artists;
            criteriaDiv = $('#results4');
            break;
    }
    if (selection) {
        criteriaDiv.empty();
        Array.from(selection.keys()).forEach(function(item) {
            criteriaDiv.append("<button class='criteriaButton' id='" + item + "' style='background-color:#fe0000ff; color: white;'>" + selection.get(item) + '</button>');
        })
    }

}

$(document).ready(function() {
    $('#genre').keyup(function() {
        var query = $('#genre').val();
        if (!(query == null || query.trim() === '')) {
            $.get('/search', {
                query: query
            }, function(data) {
                $('#results').empty();
                data.forEach(function(item) {
                    $('#results').append("<button class='criteriaButton' id='" + item.id + "'" + (genres.has(item.id.toString()) ? " style='background-color:#fe0000ff; color: white;'>" : '>') + item.name + '</button>');
                });
            });
        } else {
            initCriteria("genre");
        }
    });

    $('#ost').keyup(function() {
        var query = $('#ost').val();
        if (!(query == null || query.trim() === '')) {
            $.get('/search2', {
                query: query
            }, function(data) {
                $('#results2').empty();
                data.forEach(function(item) {
                    $('#results2').append("<button class='criteriaButton' id='" + item.id + "'" + (OSTs.has(item.id.toString()) ? " style='background-color:#fe0000ff; color: white;'>" : '>') + item.name + '</button>');
                });
            });
        } else {
            initCriteria("ost");
        }
    });

    $('#circle').keyup(function() {
        var query = $('#circle').val();
        if (!(query == null || query.trim() === '')) {
            $.get('/search3', {
                query: query
            }, function(data) {
                $('#results3').empty();
                data.forEach(function(item) {
                    $('#results3').append("<button class='criteriaButton' id='" + item.id + "'" + (circles.has(item.id.toString()) ? " style='background-color:#fe0000ff; color: white;'>" : '>') + item.name + '</button>');
                });
            });
        } else {
            initCriteria("circle");
        }
    });

    $('#artist').keyup(function() {
        var query = $('#artist').val();
        if (!(query == null || query.trim() === '')) {
            $.get('/search4', {
                query: query
            }, function(data) {
                $('#results4').empty();
                data.forEach(function(item) {
                    $('#results4').append("<button class='criteriaButton' id='" + item.id + "'" + (artists.has(item.id.toString()) ? " style='background-color:#fe0000ff; color: white;'>" : '>') + item.name + '</button>');
                });
            });
        } else {
            initCriteria("artist");
        }
    });

    $('#name').keyup(function() {
        getAlbums(0);
    });

});