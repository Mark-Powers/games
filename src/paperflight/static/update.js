/**
 * Update functions
 */
function update() {
    t++
    score++
    if (startLevel) {
        plane.x += plane.vx * plane.dir
        plane.y += plane.vy
    }
    if (!isPlaneInBox({ x: plane.width, y: plane.height, width: width - (2*plane.width), height: height - (2*plane.height) })) {
        gameOver()
    }
    currLevel.items.forEach(item => {
        item.update()
    })
    if (atExit()) {
        setLevel(currLevelIndex + 1)
    }
    if(gameIsOver){
        window.clearInterval(gameInterval)
    }
}
function updateVent() {
    // Custom box since vent height is upwards
    if (isPlaneInBox({
        x: this.x,
        y: this.y - this.height,
        width: this.width,
        height: this.height
    })) {
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
    if (!this.collected && isPlaneInCircle(this)) {
        this.collected = true
        collected++
    }
}
function updateSwitch() {
    if (isPlaneInBox(this)) {
        if (!this.inBox) {
            this.inBox = true
            switchState = (switchState + 1) % this.stateCount
        }
    } else {
        this.inBox = false
    }
}
function updateSwitchRect() {
    if (isPlaneInBox(this) && switchState == this.state) {
        gameOver()
    }
}