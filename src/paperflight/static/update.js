function update() {
    t++
    score++
    if(startLevel){
        plane.x += plane.vx * plane.dir
        plane.y += plane.vy
    }
    if (plane.x < 0 || plane.x > width - plane.width || plane.y < 0 || plane.y + plane.height > height) {
        gameOver()
    }
    currLevel.items.forEach(item => {
        item.update()
    })
    currLevel.items = currLevel.items.filter(item => !item.collected )
    if (atExit()) {
        console.log("exit!")
    }
}
function updateVent() {
    if (plane.x >= this.x - plane.width && plane.x <= this.x + this.width && plane.y < this.y) {
        plane.y -= 2
    }
}
function updateBlock() {
    if (plane.x >= this.x - plane.width && plane.x <= this.x + this.width
        && plane.y >= this.y - plane.height && plane.y <= this.y + this.height) {
        gameOver()
    }
}
function isPointInRamp(x, y, ramp) {
    var yDelta = (x - ramp.x) * ramp.slope
    return ramp.x < x && x < ramp.x + ramp.width && ramp.y < y + yDelta && y + yDelta < ramp.y + ramp.height
}
function updateRamp() {
    if (isPointInRamp(plane.x, plane.y, this) ||
        isPointInRamp(plane.x + plane.width, plane.y, this) ||
        isPointInRamp(plane.x + plane.width, plane.y + plane.height, this) ||
        isPointInRamp(plane.x, plane.y + plane.height, this)) {
        gameOver()
    }
}
function updateCoin(){
    if( Math.sqrt(Math.pow(plane.x  - this.x, 2) +  Math.pow(plane.y - this.y, 2)) < this.radius
      || Math.sqrt(Math.pow(plane.x + plane.width - this.x, 2) +  Math.pow(plane.y - this.y, 2)) < this.radius){
        this.collected = true
        collected++
    }
}