// The callbacks to be called each frame on update, 
// and on draw
// The interval object
var gameInterval, selectedX, selectedY, selectedLayer, timeElapsed, timeStart, frame;
let width = 800;
let height = 600;
let fps = 30;
let gameOver = false

let mouseX, mouseY;

let IMG_WIDTH = 33
let IMG_HEIGHT = 39
let TILE_WIDTH = 2 + IMG_WIDTH
let TILE_HEIGHT = 2 + IMG_HEIGHT

var username = undefined

// leave first two blank
var board

window.onload = function () {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    document.addEventListener("mousedown", mouseDownCallback);
    document.addEventListener("mouseup", mouseUpCallback);
    document.addEventListener("mousemove", function (e) {
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

function swapTiles() {
    count = 0
    template = []
    for (var layer = 0; layer < board.length; layer++) {
        template.push([])
        for (var x = 0; x < board[layer].length; x++) {
            template[layer].push([])
            for (var y = 0; y < board[layer][x].length; y++) {
                template[layer][x].push(undefined)
                template[layer][x][y] = board[layer][x][y]
                if (board[layer][x][y] != undefined) {
                    count++
                }
            }
        }
    }
    for (var i = 0; i < count / 2; i++) {
        items.push(i)
        items.push(i)
    }
    shuffle(items)
    board = []
    for (var layer = 0; layer < template.length; layer++) {
        board.push([])
        for (var x = 0; x < template[layer].length; x++) {
            board[layer].push([])
            for (var y = 0; y < template[layer][x].length; y++) {
                board[layer][x].push(undefined)
                if (template[layer][x][y] != undefined) {
                    board[layer][x][y] = items.pop()
                }
            }
        }
    }
}

function countItems(template) {
    var count = 0;
    for (var layer = 0; layer < template.length; layer++) {
        for (var x = 0; x < template[layer].length; x++) {
            for (var y = 0; y < template[layer][x].length; y++) {
                if (template[layer][x][y]) {
                    count++
                }
            }
        }
    }
    return count
}

function loadTemplate() {
    template = dragon
    var itemCount = countItems(template) / 2
    items = []
    for (var i = 0; i < itemCount; i++) {
        items.push(i)
        items.push(i)
    }
    shuffle(items)
    board = []
    for (var layer = 0; layer < template.length; layer++) {
        board.push([])
        for (var x = 0; x < template[layer].length; x++) {
            board[layer].push([])
            for (var y = 0; y < template[layer][x].length; y++) {
                board[layer][x].push(undefined)
                if (template[layer][x][y]) {
                    board[layer][x][y] = items.pop()
                }
            }
        }
    }
}

var updateCallback = function () {
    timeElapsed = Math.floor(new Date().getTime() / 1000) - timeStart

    var done = true
    for (var layer = 0; layer < board.length; layer++) {
        for (var x = 0; x < board[layer].length; x++) {
            for (var y = 0; y < board[layer][x].length; y++) {
                if (board[layer][x][y] != undefined) {
                    done = false
                }
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

    if (gameOver) {
        ctx.fillStyle = "#000080"
        font(50)
        ctx.fillText("Congratuations", 100, 200)
        font(24)
        var minutes = Math.floor(timeElapsed / 60)
        var seconds = timeElapsed % 60
        ctx.fillText("Your final time was " + minutes + ":" + seconds, 110, 240)
        username = submitScore("picture pieces", timeElapsed, username);
        return
    }


    let tileLeftOffset = 6
    let tileBottomOffset = 6
    for (var layer = 0; layer < board.length; layer++) {
        var xOffset = layer * tileLeftOffset
        var yOffset = -1 * layer * tileBottomOffset
        for (var x = board[layer].length - 1; x >= 0; x--) {
            for (var y = 0; y < board[layer][x].length; y++) {
                if (board[layer][x][y] == undefined) {
                    continue
                }
                ctx.fillStyle = "#ffe6e6"
                ctx.beginPath()
                ctx.moveTo(x * TILE_WIDTH + xOffset, y * TILE_HEIGHT + yOffset)
                ctx.lineTo(x * TILE_WIDTH - tileLeftOffset + xOffset, y * TILE_HEIGHT + tileBottomOffset + yOffset)
                ctx.lineTo(x * TILE_WIDTH - tileLeftOffset + xOffset, (y + 1) * TILE_HEIGHT + tileBottomOffset + yOffset)
                ctx.lineTo(x * TILE_WIDTH + xOffset, (y + 1) * TILE_HEIGHT + yOffset)
                ctx.closePath()
                ctx.fill();

                ctx.fillStyle = '#ff9999'
                ctx.beginPath()
                ctx.moveTo(x * TILE_WIDTH + xOffset, (y + 1) * TILE_HEIGHT + yOffset)
                ctx.lineTo((x + 1) * TILE_WIDTH + xOffset, (y + 1) * TILE_HEIGHT + yOffset)
                ctx.lineTo((x + 1) * TILE_WIDTH - tileLeftOffset + xOffset, (y + 1) * TILE_HEIGHT + tileBottomOffset + yOffset)
                ctx.lineTo(x * TILE_WIDTH - tileLeftOffset + xOffset, (y + 1) * TILE_HEIGHT + tileBottomOffset + yOffset)
                ctx.closePath()
                ctx.fill();

                ctx.lineWidth
                ctx.strokeStyle = "#ffcc00"
                ctx.beginPath()
                ctx.moveTo(x * TILE_WIDTH + xOffset, y * TILE_HEIGHT + yOffset)
                ctx.lineTo(x * TILE_WIDTH - tileLeftOffset + xOffset, y * TILE_HEIGHT + tileBottomOffset + yOffset)
                ctx.lineTo(x * TILE_WIDTH - tileLeftOffset + xOffset, (y + 1) * TILE_HEIGHT + tileBottomOffset + yOffset)
                ctx.lineTo(x * TILE_WIDTH + xOffset, (y + 1) * TILE_HEIGHT + yOffset)
                ctx.closePath()
                ctx.stroke();
                ctx.beginPath()
                ctx.moveTo(x * TILE_WIDTH + xOffset, (y + 1) * TILE_HEIGHT + yOffset)
                ctx.lineTo((x + 1) * TILE_WIDTH + xOffset, (y + 1) * TILE_HEIGHT + yOffset)
                ctx.lineTo((x + 1) * TILE_WIDTH - tileLeftOffset + xOffset, (y + 1) * TILE_HEIGHT + tileBottomOffset + yOffset)
                ctx.lineTo(x * TILE_WIDTH - tileLeftOffset + xOffset, (y + 1) * TILE_HEIGHT + tileBottomOffset + yOffset)
                ctx.closePath()
                ctx.stroke();
            }
        }

        ctx.strokeStyle = "#ffcc00"
        var xOffset = layer * tileLeftOffset
        var yOffset = -1 * layer * tileBottomOffset
        for (var x = 0; x < board[layer].length; x++) {
            for (var y = 0; y < board[layer][x].length; y++) {
                if (board[layer][x][y] == undefined) {
                    continue
                }
                ctx.strokeRect(x * TILE_WIDTH + xOffset, y * TILE_HEIGHT + yOffset, TILE_WIDTH, TILE_HEIGHT)
                ctx.drawImage(document.getElementById("img" + board[layer][x][y]), 1 + x * TILE_WIDTH + xOffset, 1 + y * TILE_HEIGHT + yOffset)
            }
        }
    }

    ctx.strokeStyle = "#ffcc00"
    ctx.fillStyle = "#ffcc00"
    font(24)
    ctx.fillText("Time: " + timeElapsed, 600, 36)
    ctx.fillText("Shuffle", 650, 130)

    if (650 - 10 < mouseX && mouseX < 700 + 10 && 150 - 10 < mouseY && mouseY < 150 + 10) {
        ctx.fillStyle = "#ffee22"
    } else {
        ctx.fillStyle = "#ffcc00"
    }
    ctx.beginPath();
    ctx.moveTo(700, 150 + 10)
    ctx.arc(650, 150, 10, Math.PI / 2, 3 * Math.PI / 2)
    ctx.lineTo(700, 150 - 10)
    ctx.arc(700, 150, 10, 3 * Math.PI / 2, Math.PI / 2)
    ctx.fill();
    // ctx.fillRect(625, 125, 150, 20)

    ctx.strokeStyle = "red"
    xOffset = selectedLayer * tileLeftOffset
    yOffset = -1 * selectedLayer * tileBottomOffset
    if (selectedX != undefined && selectedY != undefined && selectedLayer != undefined && board[selectedLayer][selectedX][selectedY] != undefined) {
        ctx.beginPath();
        let rad = TILE_WIDTH / 2 + Math.cos(frame / 7) * 2
        ctx.arc(selectedX * TILE_WIDTH + TILE_WIDTH / 2 + xOffset, selectedY * TILE_HEIGHT + TILE_HEIGHT / 2 + yOffset, rad, 0, 2 * Math.PI)
        ctx.stroke()
    }
}

var mouseDownCallback = function (e) {
    if (650 - 10 < mouseX && mouseX < 700 + 10 && 150 - 10 < mouseY && mouseY < 150 + 10) {
        swapTiles(board)
        return
    }

    var tileX = Math.floor(e.x / TILE_WIDTH)
    var tileY = Math.floor(e.y / TILE_HEIGHT)
    for (var layer = board.length - 1; layer >= 0; layer--) {
        if (board[layer][tileX] != undefined && board[layer][tileX][tileY] != undefined) {
            tileLayer = layer
            break
        }
    }
    console.log(tileLayer, tileX, tileY)

    if (tileLayer != undefined && board[tileLayer][tileX] != undefined && board[tileLayer][tileX][tileY] != undefined) {
        console.log("inside if")
        if (selectedX != undefined &&
            selectedY != undefined &&
            selectedLayer != undefined) {
            console.log("inside if 2")
            if (board[selectedLayer][selectedX][selectedY] != undefined &&
                (tileX != selectedX || tileY != selectedY) &&
                (board[tileLayer][tileX + 1][tileY] == undefined || board[tileLayer][tileX - 1][tileY] == undefined)) {
                console.log("inside if 3")
                console.log(board[selectedLayer][selectedX][selectedY], board[tileLayer][tileX][tileY])
                if (board[selectedLayer][selectedX][selectedY] == board[tileLayer][tileX][tileY]) {
                    console.log("inside if 4")
                    board[selectedLayer][selectedX][selectedY] = undefined
                    board[selectedLayer][tileX][tileY] = undefined
                }
            }
        }
        if (board[tileLayer][tileX + 1][tileY] == undefined || board[tileLayer][tileX - 1][tileY] == undefined) {
            console.log("new selection")
            selectedLayer = tileLayer
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
