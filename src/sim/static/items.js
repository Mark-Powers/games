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
        callback: function () { 
            var type = tileMap[Math.floor(Math.random() * 3)]
            var tile = new type()
            status = `Your scout found a ${tile.name}. Click to place it.`
            return {
                tile: tile
            }
        }
    }
}