// The callbacks to be called each frame on update, 
// and on draw
// The interval object
var gameInterval, selectedX, selectedY, timeElapsed, timeStart, frame;
let width = 800;
let height = 600;
let fps = 30;
let gameOver = false

let mouseX, mouseY;

let IMG_WIDTH = 33
let IMG_HEIGHT = 39
let TILE_WIDTH = 2 + IMG_WIDTH
let TILE_HEIGHT = 2 + IMG_HEIGHT

// leave first two blank
var board

window.onload = function () {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    document.addEventListener("mousedown", mouseDownCallback);
    document.addEventListener("mouseup", mouseUpCallback);
    document.addEventListener("mousemove", function(e){
        mouseX = e.x
        mouseY = e.y
    });
    init();
}

function game() {
    frame++
    updateCallback();
    drawCallback();
}

function init() {
    gameInterval = setInterval(game, 1000 / fps);
    timeStart = Math.floor(new Date().getTime() / 1000)
    timeElapsed = 0
    frame = 0
    loadTemplate()
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function swapTiles(){
    count = 0
    template = []
    for (var x = 0; x < board.length; x++) {
        template.push([])
        for (var y = 0; y < board[x].length; y++) {
            template[x].push(undefined)
            template[x][y] = board[x][y]
            if(board[x][y] != undefined){
                count++
            }
        }
    }
    for (var i = 0; i < count/2; i++) {
        items.push(i)
        items.push(i)
    }
    shuffle(items)
    board = []
    for (var x = 0; x < template.length; x++) {
        board.push([])
        for (var y = 0; y < template[x].length; y++) {
            board[x].push(undefined)
            if (template[x][y] != undefined) {
                board[x][y] = items.pop()
            }
        }
    }
}

function loadTemplate() {
    template = dragon
    items = []
    for (var i = 0; i < 8; i++) {
        items.push(i)
        items.push(i)
    }
    shuffle(items)
    board = []
    for (var x = 0; x < template.length; x++) {
        board.push([])
        for (var y = 0; y < template[x].length; y++) {
            board[x].push(undefined)
            if (template[x][y]) {
                board[x][y] = items.pop()
            }
        }
    }
}

var updateCallback = function () {
    timeElapsed = Math.floor(new Date().getTime() / 1000) - timeStart

    var done = true
    for (var x = 0; x < board.length; x++) {
        for (var y = 0; y < board[x].length; y++) {
            if (board[x][y] != undefined) {
                done = false
            }
        }
    }
    if (done) {
        clearInterval(gameInterval)
        gameOver = true
    }
}

var drawCallback = function () {
    font(48);
    ctx.fillStyle = "#99b3ff";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#b30000"
    ctx.fillRect(0, 0, 800, 50)
    ctx.fillRect(600, 0, 200, 600)
    ctx.lineWidth = 2
    ctx.strokeStyle = "#ffcc00"
    ctx.fillStyle = "#ffcc00"
    ctx.strokeRect(1, 50, 600, 549)
    font(50)
    ctx.fillText("Picture Pieces", 100, 36)

    if(gameOver){
        ctx.fillStyle = "#000080"
        font(50)
        ctx.fillText("Congratuations", 100, 200)
        font(24)
        var minutes = Math.floor(timeElapsed / 60)
        var seconds = timeElapsed % 60
        ctx.fillText("Your final time was " + minutes + ":" + seconds, 110, 240)
        return
    }

    
    for (var x = board.length-1; x >= 0; x--) {
        for (var y = 0; y < board[x].length; y++) {
            if (board[x][y] == undefined) {
                continue
            }
            ctx.fillStyle = "#ffe6e6"
            ctx.beginPath()
            ctx.moveTo(x * TILE_WIDTH, y * TILE_HEIGHT)
            ctx.lineTo(x * TILE_WIDTH-6, y * TILE_HEIGHT+6)
            ctx.lineTo(x * TILE_WIDTH-6, (y+1) * TILE_HEIGHT+6)
            ctx.lineTo(x * TILE_WIDTH, (y+1) * TILE_HEIGHT)
            ctx.closePath()
            ctx.fill();

            ctx.fillStyle = '#ff9999'
            ctx.beginPath()
            ctx.moveTo(x * TILE_WIDTH, (y+1) * TILE_HEIGHT)
            ctx.lineTo((x+1) * TILE_WIDTH, (y+1) * TILE_HEIGHT)
            ctx.lineTo((x+1) * TILE_WIDTH-6, (y+1) * TILE_HEIGHT+6)
            ctx.lineTo(x * TILE_WIDTH-6, (y+1) * TILE_HEIGHT+6)
            ctx.closePath()
            ctx.fill();

            ctx.lineWidth
            ctx.strokeStyle = "#ffcc00"
            ctx.beginPath()
            ctx.moveTo(x * TILE_WIDTH, y * TILE_HEIGHT)
            ctx.lineTo(x * TILE_WIDTH-6, y * TILE_HEIGHT+6)
            ctx.lineTo(x * TILE_WIDTH-6, (y+1) * TILE_HEIGHT+6)
            ctx.lineTo(x * TILE_WIDTH, (y+1) * TILE_HEIGHT)
            ctx.closePath()
            ctx.stroke();
            ctx.beginPath()
            ctx.moveTo(x * TILE_WIDTH, (y+1) * TILE_HEIGHT)
            ctx.lineTo((x+1) * TILE_WIDTH, (y+1) * TILE_HEIGHT)
            ctx.lineTo((x+1) * TILE_WIDTH-6, (y+1) * TILE_HEIGHT+6)
            ctx.lineTo(x * TILE_WIDTH-6, (y+1) * TILE_HEIGHT+6)
            ctx.closePath()
            ctx.stroke();

            // ctx.strokeRect(x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT)
        }
    }

    ctx.strokeStyle = "#ffcc00"
    for (var x = 0; x < board.length; x++) {
        for (var y = 0; y < board[x].length; y++) {
            if (board[x][y] == undefined) {
                continue
            }
            ctx.strokeRect(x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT)
            ctx.drawImage(document.getElementById("img" + board[x][y]), 1 + x * TILE_WIDTH, 1 + y * TILE_HEIGHT)
        }
    }


    ctx.strokeStyle = "#ffcc00"
    ctx.fillStyle = "#ffcc00"
    font(24)
    ctx.fillText("Time: " + timeElapsed, 600, 36)
    ctx.fillText("Shuffle", 650, 130)

    if(650 - 10 < mouseX && mouseX < 700+10 && 150-10 < mouseY && mouseY < 150+10){
        ctx.fillStyle = "#ffee22"
    } else {
        ctx.fillStyle = "#ffcc00"
    }
    ctx.beginPath();
    ctx.moveTo(700, 150+10)
    ctx.arc(650, 150, 10, Math.PI/2, 3*Math.PI/2)
    ctx.lineTo(700, 150-10)
    ctx.arc(700, 150, 10, 3*Math.PI/2, Math.PI/2)
    ctx.fill(); 
    // ctx.fillRect(625, 125, 150, 20)

    ctx.strokeStyle = "red"
    if (selectedX != undefined && selectedY != undefined && board[selectedX][selectedY] != undefined) {
        ctx.beginPath();
        let rad = TILE_WIDTH / 2 + Math.cos(frame / 7) * 2
        ctx.arc(selectedX * TILE_WIDTH + TILE_WIDTH / 2, selectedY * TILE_HEIGHT + TILE_HEIGHT / 2, rad, 0, 2 * Math.PI)
        ctx.stroke()
    }
}

var mouseDownCallback = function (e) {
    if(650 - 10 < mouseX && mouseX < 700+10 && 150-10 < mouseY && mouseY < 150+10){
        swapTiles(board)
        return
    }

    var tileX = Math.floor(e.x / TILE_WIDTH)
    var tileY = Math.floor(e.y / TILE_HEIGHT)
    if (board[tileX] != undefined && board[tileX][tileY] != undefined) {
        if (selectedX != undefined &&
            selectedY != undefined) {
            if (board[selectedX][selectedY] != undefined &&
                (tileX != selectedX || tileY != selectedY) &&
                (board[tileX + 1][tileY] == undefined || board[tileX - 1][tileY] == undefined)) {
                if (board[selectedX][selectedY] == board[tileX][tileY]) {
                    board[selectedX][selectedY] = undefined
                    board[tileX][tileY] = undefined
                }
            }
        }
        if (board[tileX + 1][tileY] == undefined || board[tileX - 1][tileY] == undefined) {
            selectedX = tileX
            selectedY = tileY
        }
    }
}

var mouseUpCallback = function (e) {

}

function font(size) {
    ctx.font = size + "px Courier";
}
