const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

//the offset of the sprites
var offset = {
    x: canvas.width / 2 - 1100,
    y: canvas.height / 2 - 1000
}

//function to set a cookie, expiration time in min
function setCookie(cookieName, cookieValue, expirationMinutes) {
    const d = new Date();
    d.setTime(d.getTime() + (expirationMinutes * 60 * 1000)); // Convert minutes to milliseconds
    const expires = "expires=" + d.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

// Function to get a cookie value by name
function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }

    return null;
}


const gameInitiated = getCookie('gameInitiated');

// function resize() {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//     //the offset of the sprites
//     offset = {
//         x: canvas.width / 2 - 1100,
//         y: canvas.height / 2 - 1100
//     }
//     location.reload();
// }

window.addEventListener('resize', function() {
    // resize();
    if (window.RT) clearTimeout(window.RT);
    window.RT = setTimeout(function()
    {
        this.location.reload(false); /* false to get page from cache */
  }, 100);
});

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, 70 + i))
}

//zones for portal on the top right
const zonesResume = []
for (let i = 0; i < TopRightPort.length; i += 70) {
    zonesResume.push(TopRightPort.slice(i, 70 + i))
}

//zones for portal in house
const zonesAbout = []
for (let i = 0; i < zoneHouse.length; i += 70) {
    zonesAbout.push(zoneHouse.slice(i, 70 + i))
}

//zones for portal near farm
const zonesPort = []
for (let i = 0; i < zoneFarm.length; i += 70) {
    zonesPort.push(zoneFarm.slice(i, 70 + i))
}

//zones for portal near boat
const zonesContact = []
for (let i = 0; i < zoneBoat.length; i += 70) {
    zonesContact.push(zoneBoat.slice(i, 70 + i))
}

//zones for house roof
const zonesRoof = []
for (let i = 0; i < roofZone.length; i += 70) {
    zonesRoof.push(roofZone.slice(i, 70 + i))
}

const boundaries = []

// CLASSES
class Sprite {
    constructor({ position, image, frames = { max: 1}, sprites = []}) {
        this.position = position
        this.image = image
        this.frames = {...frames, val: 0, elapsed: 0}

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.moving = false
        this.sprites = sprites
    }

    draw() {
        c.drawImage(
            this.image,
            this.frames.val * 39,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        )
        if(!this.moving) return

        if (this.frames.max > 1) {
            this.frames.elapsed++
        }

        if(this.frames.elapsed % 10 === 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++
            else this.frames.val = 0
        }
    }
}

class Boundary {
    static width = 56
    static height = 56
    constructor ({position}) {
        this.position = position
        this.width = 56
        this.height = 56
    }

    draw() {
        c.fillStyle = 'rgba(255, 0, 0, 0)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}


collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1427)
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
    })
})

const zonesR = []

zonesResume.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1427)
            zonesR.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
    })
})

const zonesA = []

zonesAbout.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1427)
            zonesA.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
    })
})

const zonesP = []

zonesPort.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1427)
            zonesP.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
    })
})

const zonesC = []

zonesContact.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1427)
            zonesC.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
    })
})

const zonesRO = []

zonesRoof.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1427)
            zonesRO.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
    })
})

const image = new Image()
image.src = '/images/Map3.png'

const foregroundimage = new Image()
foregroundimage.src = '/images/foreground.png'

const roofimage = new Image()
roofimage.src = '/images/roof.png'

const playerImage = new Image()
playerImage.src = '/images/standing.png'

const playerUpImage = new Image()
playerUpImage.src = '/images/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = '/images/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = '/images/playerRight.png'

const playerDownImage = new Image()
playerDownImage.src = '/images/playerDown.png'


const player = new Sprite({
    position: {
        x: canvas.width / 2 - 156 / 5 / 2,
        y: canvas.height / 2 - 75 / 2
    },
    image: playerImage,
    frames: {max: 4},
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage,
        idle: playerImage
    }
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundimage
})

const roof = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: roofimage
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

const movables = [background, ...boundaries, foreground, ...zonesR, ...zonesA, ...zonesC, ...zonesP, ...zonesRO, roof]

function rectangularCollision({rectangle1, rectangle2}){
    return (rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
}

const popup = {
    initiated: false
}

const play = {
    init: false
}

// check whether the playbtn was clicked, and if so, set play.init to true and hide menu
if (!gameInitiated) {
    document.getElementById('playbtn').addEventListener("click", function() {
        play.init = true
        //set cookie to bypass start menu and initial text
        setCookie('gameInitiated', 'true', 10);
    
        $('#welcome-menu').fadeOut(2000, function() {
            $('#welcome-menu').css('visibility','hidden');
        });
        $('#menubtn').fadeIn(2000, function() {
            $('#menubtn').removeClass('hidden');
        })
        addText();
    }, {once:true});
}

//if they have visited the site before and init game, then skip the menu
if (gameInitiated) {
    play.init = true;
    document.getElementById('welcome-menu').style.visibility = "hidden";
    document.getElementById('menubtn').classList.remove('hidden');
}

//check whether menu button is clicked: display menu.
var menubtn = document.getElementById('menubtn')
var overlay = document.getElementById('overlay')
var menu = document.getElementById('menu')
var about = document.getElementById('aboutbtn')
var portfolio = document.getElementById('portbtn')
var resume = document.getElementById('resumebtn')
var contact = document.getElementById('contactbtn')
var closebtn = document.getElementById('closebtn')

function closeMenu() {
    overlay.classList.add('hidden')
    menu.classList.add('hidden')
}

function openModal(id) {
    popup.initiated = true
    overlay.classList.remove('hidden')
    $('#modalpage').removeClass('hidden')
    $(id).addClass('active')

    if ($('.active')) {
        $('.active').removeClass('hidden');
    }

    $('#next').click(function() {
        var nextDiv = $('.active').next('.content');
        if($('.active').next('.content').length == 0) {
            nextDiv = $('.active').parent().find('.content:first');
        }
        $('.active').addClass('hidden');
        $('.active').removeClass('active');
        nextDiv.addClass('active');
        nextDiv.removeClass('hidden');
    });

    $('#prev').click(function() {
        var nextDiv = $('.active').prev('.content');
        if($('.active').prev('.content').length == 0) {
            nextDiv = $('.active').parent().find('.content:last');
        }
        $('.active').addClass('hidden');
        $('.active').removeClass('active');
        nextDiv.addClass('active');
        nextDiv.removeClass('hidden');
    });

    $('#exit').click(function() {
        $('.active').addClass('hidden').removeClass('active');
        popup.initiated = false
        overlay.classList.add('hidden')
        $('#modalpage').addClass('hidden')
    });
}


// show menu
menubtn.addEventListener('click', function() {
    popup.initiated = true
    overlay.classList.remove('hidden')
    menu.classList.remove('hidden')
});

//hide menu
closebtn.addEventListener('click', function() {
    popup.initiated = false
    closeMenu()
});

about.addEventListener('click', function() {
    closeMenu()
    openModal('#about-text')
});

portfolio.addEventListener('click', function() {
    closeMenu()
    //teleportPort()
    openModal('#port-text')
});

resume.addEventListener('click', function() {
    closeMenu()
    //teleportResume()
    openModal('#resume-text')
});

contact.addEventListener('click', function() {
    closeMenu()
    //teleportContact()
    openModal('#contact-text')
});

function addText() {
    //container where text will go
    var container = $('#text');

    //What the player will be saying
    var textLines = [
        "Hello! My name is Alex Sanchez",
        "Welcome to my Portfolio Page!",
        "Use AWSD keys to move around",
        "Step on portals to learn who I am and what I do",
        "Or use the menu to skip straight to the content"
    ];

    //fade in white container
    if (!gameInitiated) {
        setTimeout(function(){
            $('#textCont').fadeIn(350, function() {
                $('#textCont').removeClass('hidden');
                displayText();
            });
        }, 1000)
    }

    var lineIndex = 0;
    var charIndex = 0;

    //display the text char by char
    function displayText() {
        if (gameInitiated) {
            // If cookie is initiated, clear the container and hide it immediately
            container.empty();
            $("#textCont").fadeOut(20, function () {
                $("#textCont").addClass('hidden');
            });
            return; // Exit the function early
        }

        if (popup.initiated) {
            // If popup is initiated, clear the container and hide it immediately
            container.empty();
            $("#textCont").fadeOut(50, function () {
                $("#textCont").addClass('hidden');
            });
            return; // Exit the function early
        }
        if (lineIndex < textLines.length) {
            var line = textLines[lineIndex];
            if (charIndex < line.length) {
                var char = line.charAt(charIndex);
                container.append(char);
                charIndex++;

                // Adjust the delay based on whether the character is a space
                var delay = char === ' ' ? 0 : 70;

                setTimeout(displayText, delay);
            } else {
                lineIndex++;
                charIndex = 0;
                setTimeout(function() {
                    container.empty(); // Clear the container after each line
                    displayText(); // Move to the next line
                }, 1200); // Wait for 1200 milliseconds (1.5 seconds) before moving to the next line
            }
        } else {
            // All lines are displayed, fade out the container
            $("#textCont").fadeOut(500, function () {
                $("#textCont").addClass('hidden');
            });
        }
    }
}

const AplayerOnZone = { value: false };
const RplayerOnZone = { value: false };
const PplayerOnZone = { value: false };
const CplayerOnZone = { value: false };

// Function to check if player is inside a zone
function checkPlayerInZone(player, zones, playerOnZone, modalSelector) {
    const centerX = zones.reduce((sum, zone) => sum + zone.position.x, 0) / zones.length;
    const centerY = zones.reduce((sum, zone) => sum + zone.position.y, 0) / zones.length;

    const playerX = player.position.x + player.width / 2;
    const playerY = player.position.y + player.height / 2;

    if (
        playerX >= centerX - (zones[0].width / 2) &&
        playerX <= centerX + (zones[0].width / 2) &&
        playerY >= centerY - (zones[0].height / 2) &&
        playerY <= centerY + (zones[0].height / 2)
    ) {
        if (!playerOnZone.value) {
            openModal(modalSelector);
            playerOnZone.value = true;
        }
    } else {
        // Check if the player has left the zone and set a timeout
        if (playerOnZone.value) {
            setTimeout(() => {
                playerOnZone.value = false;
            }, 500);
        }
    }
}

//animate canvas
function animate() {
    window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw()
    })
    zonesR.forEach(zonesR => {
        zonesR.draw()
    })
    zonesA.forEach(zonesA => {
        zonesA.draw()
    })
    zonesP.forEach(zonesP => {
        zonesP.draw()
    })
    zonesC.forEach(zonesC => {
        zonesC.draw()
    })
    zonesRO.forEach(zonesRO => {
        zonesRO.draw()
    })

    //after clicking play, draw player
    if (play.init) {
        player.draw()
    }
    foreground.draw()

    //check if player is under roof
    let isPlayerOutside = true;

    for (const zone of zonesRO) {
        const playerX = player.position.x + player.width / 2;
        const playerY = player.position.y + player.height / 2;

        if (
            playerX >= zone.position.x &&
            playerX <= zone.position.x + zone.width &&
            playerY >= zone.position.y &&
            playerY <= zone.position.y + zone.height
        ) {
            isPlayerOutside = false; // Player is inside at least one zone
            break; // No need to continue checking other zones
        }
    }

    if (isPlayerOutside) {
        roof.draw(); // Draw the roof only if the player is outside all zones
    }


    let moving = true
    player.moving = false
    if (popup.initiated) return
    if (!play.init) return

    //check if player is on one of the portals
    checkPlayerInZone(player, zonesA, AplayerOnZone, '#about-text');
    checkPlayerInZone(player, zonesR, RplayerOnZone, '#resume-text');
    checkPlayerInZone(player, zonesP, PplayerOnZone, '#port-text');
    checkPlayerInZone(player, zonesC, CplayerOnZone, '#contact-text');
    
    //checks collisions
    if (keys.w.pressed) {
        player.moving = true
        player.image = player.sprites.up

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 4
                    }}
                })
            ) {
                moving = false
                break
            }
        }
        if (moving)
        movables.forEach((movable) => {
            movable.position.y += 4
        })
    }

    if (keys.s.pressed) {
        player.moving = true
        player.image = player.sprites.down
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 4
                    }}
                })
            ) {
                moving = false
                break
            }
        }
        if (moving)
        movables.forEach((movable) => {
            movable.position.y -= 4
        })
    }

    if (keys.a.pressed) {
        player.moving = true
        player.image = player.sprites.left
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x + 4,
                        y: boundary.position.y
                    }}
                })
            ) {
                moving = false
                break
            }
        }
        if (moving)
        movables.forEach((movable) => {
            movable.position.x += 4
        })
    }

    if (keys.d.pressed) {
        player.moving = true
        player.image = player.sprites.right
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x - 4,
                        y: boundary.position.y
                    }}
                })
            ) {
                moving = false
                break
            }
        }
        if (moving)
        movables.forEach((movable) => {
            movable.position.x -= 4
        })
    }

    
}
animate()

// check for key down
let lastKey = ''
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed=true
            break
        case 'a':
            keys.a.pressed=true
            break
        case 's':
            keys.s.pressed=true
            break
        case 'd':
            keys.d.pressed=true
            break
    }
});

// check for key up
window.addEventListener('keyup', (e) => {
    player.image = player.sprites.idle
    switch (e.key) {
        case 'w':
            keys.w.pressed=false
            break
        case 'a':
            keys.a.pressed=false
            break
        case 's':
            keys.s.pressed=false
            break
        case 'd':
            keys.d.pressed=false
            break
    }
});

// Allow movement on mobile devices
let touchStartX = 0;
let touchStartY = 0;
let touchThreshold = 20; // Adjust as needed for sensitivity
    
// Check for swipes
window.addEventListener('touchstart', e => {
    e.preventDefault();
    touchStartX = e.changedTouches[0].pageX;
    touchStartY = e.changedTouches[0].pageY;
});
    
window.addEventListener('touchmove', e => {
    e.preventDefault();
    const touchEndX = e.changedTouches[0].pageX;
    const touchEndY = e.changedTouches[0].pageY;
    
    const swipeDistanceX = touchEndX - touchStartX;
    const swipeDistanceY = touchEndY - touchStartY;
    
    if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY)) {
        // Horizontal swipe
        if (Math.abs(swipeDistanceX) > touchThreshold) {
            if (swipeDistanceX < 0) {
                // Swipe left, equivalent to pressing 'a'
                keys.a.pressed = true;
                keys.d.pressed = false;
                keys.s.pressed = false;
                keys.w.pressed = false;
            } else {
                // Swipe right, equivalent to pressing 'd'
                keys.d.pressed = true;
                keys.a.pressed = false;
                keys.s.pressed = false;
                keys.w.pressed = false;
            }
        }
    } else {
        // Vertical swipe
        if (Math.abs(swipeDistanceY) > touchThreshold) {
            if (swipeDistanceY < 0) {
                // Swipe up, equivalent to pressing 'w'
                keys.w.pressed = true;
                keys.a.pressed = false;
                keys.d.pressed = false;
                keys.s.pressed = false;
            } else {
                // Swipe down, equivalent to pressing 's'
                keys.s.pressed = true;
                keys.w.pressed = false;
                keys.a.pressed = false;
                keys.d.pressed = false;
            }
        }
    }
});
    
window.addEventListener('touchend', e => {
    e.preventDefault();
    // Reset all movement keys to false
    keys.w.pressed = false;
    keys.a.pressed = false;
    keys.s.pressed = false;
    keys.d.pressed = false;
});