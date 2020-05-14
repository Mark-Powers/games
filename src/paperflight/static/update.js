function isPointInRamp(x, y, ramp) {
    var yDelta = (x - ramp.x) * ramp.slope
    return ramp.x < x && x < ramp.x + ramp.width && ramp.y < y + yDelta && y + yDelta < ramp.y + ramp.height
}
function isPointInBox(x, y, box) {
    return box.x <= x && x <= box.x + box.width && box.y <= y && y <= box.y + box.height
}
function isPlaneInBox(box) {
    return isPointInBox(plane.x, plane.y, box)
        || isPointInBox(plane.x + plane.width, plane.y, box)
        || isPointInBox(plane.x + plane.width, plane.y + plane.height, box)
        || isPointInBox(plane.x, plane.y + plane.height, box)
}
function update() {
    t++
    score++
    if (startLevel) {
        plane.x += plane.vx * plane.dir
        plane.y += plane.vy
    }
    if (plane.x < 0 || plane.x > width - plane.width || plane.y < 0 || plane.y + plane.height > height) {
        gameOver()
    }
    currLevel.items.forEach(item => {
        item.update()
    })
    currLevel.items = currLevel.items.filter(item => !item.collected)
    if (atExit()) {
        console.log("exit!")
    }
}
function updateVent() {
    // Custom box since vent height is upwards
    if (isPlaneInBox({
        x: this.x, 
        y: this.y-this.height, 
        width: this.width, 
        height: this.height})) {
        plane.y -= 2
    }
}
function updateBlock() {
    if (isPlaneInBox(this)) {
        gameOver()
    }
}
function updateRamp() {
    if (isPointInRamp(plane.x, plane.y, this) ||
        isPointInRamp(plane.x + plane.width, plane.y, this) ||
        isPointInRamp(plane.x + plane.width, plane.y + plane.height, this) ||
        isPointInRamp(plane.x, plane.y + plane.height, this)) {
        gameOver()
    }
}
function updateCoin() {
    if (Math.sqrt(Math.pow(plane.x - this.x, 2) + Math.pow(plane.y - this.y, 2)) < this.radius
        || Math.sqrt(Math.pow(plane.x + plane.width - this.x, 2) + Math.pow(plane.y - this.y, 2)) < this.radius) {
        this.collected = true
        collected++
    }
}
function updateSwitch() {
    if(isPlaneInBox(this)){
        if(!this.inBox){
            this.inBox = true
            switchState = (switchState + 1) % this.stateCount
        }
    } else {
        this.inBox = false
    }
}
function updateSwitchRect() {
    if(isPlaneInBox(this) && switchState == this.state){
        gameOver()
    }
}