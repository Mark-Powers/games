// The callbacks to be called each frame on update, 
// and on draw
var updateCallback, drawCallback, mouseDownCallback, mouseUpCallback;
// The interval object
var gameInterval;
let width = 800;
let height = 600;
let fps = 30;

window.onload = function () {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    document.addEventListener("keydown", keyPush);
    document.addEventListener("mousedown", mouseDown);
    document.addEventListener("mouseup", mouseUp);
    init();
}

function switchState(game) {
    updateCallback = game.updateCallback;
    drawCallback = game.drawCallback;
    mouseDownCallback = game.mouseDownCallback;
    mouseUpCallback = game.mouseUpCallback; 
}

function game() {
    updateCallback();
    drawCallback();
}

function init() {
    switchState(menu);
    gameInterval = setInterval(game, 1000 / fps);

    let buttonX = (width / 5) * 1 // 2/5 the width
    let buttonWidth = (width / 5) * 3
    let buttonHeight = 40
    menu.buttons.forEach((gameData, i) => {
        gameData.x = buttonX;
        gameData.y = (buttonHeight + 10) * i + 200;
        gameData.width = buttonWidth;
        gameData.height = buttonHeight;
    })
    menu.buttons.push({
        x: 680,
        y: 530,
        width: 100,
        height: buttonHeight, 
        name: "Help",
        game: help,
    })
}

var menu = {
    "buttons": [
        {
            "name": "Nim",
            "game": nim,
        },
        // {
        //     "name": "Solitaire",
        //     "game": solitaire,
        // },
        {
            "name": "Kings Corner",
            "game": kings_corner,
        },
        {
            "name": "Black Hole",
            "game": black_hole,
        },
    ]
};
menu.updateCallback = function () {

}
menu.drawCallback = function () {
    font(48);
    ctx.fillStyle = "#99b3ff";
    ctx.fillRect(0, 0, width, height);

    menu.buttons.forEach((gameData, i) => {
        button(gameData.x, gameData.y, gameData.width, gameData.height, gameData.name, gameData.isClicked);
    })
}

menu.mouseDownCallback = function (e) {
    let newGame = buttonAt(e.x, e.y, menu.buttons);
    if(newGame){
        newGame.isClicked = true;
    }
}

menu.mouseUpCallback = function (e) {
    let newGame = buttonAt(e.x, e.y, menu.buttons);
    if(newGame && newGame.isClicked){
        switchState(newGame.game)
    }
    menu.buttons.forEach((gameData, i) => {
        gameData.isClicked = false;
    })
}

function buttonAt(x, y, buttons) {
    return buttons.find((gameData, i) => {
        if (gameData.x < x && x < gameData.x + gameData.width
            && gameData.y < y && y < gameData.y + gameData.height) {
            return true;
        }
    })
}

function font(size) {
    ctx.font = size + "px Courier";
}

function keyPush(e) {

}

function mouseDown(e) {
    mouseDownCallback(e);
}

function mouseUp(e) {
    mouseUpCallback(e);
}

function button(x, y, w, h, text, isClicked){
    if(isClicked){
        ctx.fillStyle = "grey"
    } else {
        ctx.fillStyle = "darkgrey"
    }
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "black"
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x+w, y);
    ctx.lineTo(x+w, y+h);
    ctx.lineTo(x, y+h);
    ctx.lineTo(x, y);
    ctx.stroke(); 
    font(36);
    ctx.fillStyle = "black"
    ctx.fillText(text, x+5, y+h-8)
}
