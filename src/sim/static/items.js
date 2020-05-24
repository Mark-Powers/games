tileMap = {
    0: Mountain,
    1: Forest,
    2: Town,
}

function getScout() {
    return { 
        id: 1, 
        text: "scout", 
        cost: 2, 
        callback: function (game) { 
            var type = tileMap[Math.floor(Math.random() * 3)]
            var tile = new type()
            messages.push(`Your scout found a ${tile.name}.`)

            var randX, randY
            do {
                randX = Math.floor(width * Math.random())
                randY = Math.floor(height * Math.random())
            } while(game.level[randX][randY] != undefined)
            game.level[randX][randY] = tile
        }
    }
}