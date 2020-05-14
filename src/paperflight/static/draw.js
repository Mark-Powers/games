function draw() {
    ctx.fillStyle = "#4444ff"
    ctx.fillRect(0, 0, width, height)

    currLevel.items.forEach(item => {
        item.draw()
    })
    drawExit(currLevel.exit)
    
    drawPlane()

    ctx.fillStyle = "#222"
    ctx.font = "20px Courier"
    ctx.fillText(`Level ${currLevelIndex} (${collected}/${currLevel.coinsNeeded}) - ${currLevel.title} - Time ${Math.round(t / fps / 60)}:${Math.round(t / fps) % 60}`, 20, 20)

}
function drawPlane() {
    ctx.fillStyle = "#fff"
    ctx.strokeStyle = "#111"
    ctx.lineWidth = 3
    ctx.beginPath();
    if (plane.dir < 0) {
        ctx.moveTo(plane.x + plane.width, plane.y);
        ctx.lineTo(plane.x, plane.y);
        ctx.lineTo(plane.x + plane.width + 4, plane.y + plane.height);
        ctx.lineTo(plane.x + plane.width, plane.y);
    } else {
        ctx.moveTo(plane.x, plane.y);
        ctx.lineTo(plane.x + plane.width, plane.y);
        ctx.lineTo(plane.x + 4, plane.y + plane.height);
        ctx.lineTo(plane.x, plane.y);
    }
    ctx.stroke();
    ctx.fill();
}
function drawVent() {
    ctx.fillStyle = "#ccc"
    ctx.fillRect(this.x, this.y, this.width, 10)
    ctx.fillStyle = "white"
    var yDelta = Math.sin(t / 30) * 40 
    for (var i = 40; i < this.height; i+= 60) {
        for (var j = 0; j < this.width; j+= 30) {
            ctx.fillRect(this.x+j, this.y - i + yDelta, 1, 8)
        }
    }
}
function drawBlock() {
    ctx.fillStyle = "#0d0"
    ctx.fillRect(this.x, this.y, this.width, this.height)
}
function drawRamp() {
    ctx.fillStyle = "#0d0"
    var delta = this.width * this.slope
    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    // Note we subtract beause y=0 is top
    ctx.lineTo(this.x + this.width, this.y - delta)
    ctx.lineTo(this.x + this.width, this.y + this.height - delta)
    ctx.lineTo(this.x, this.y + this.height)
    ctx.lineTo(this.x, this.y)
    ctx.stroke()
    ctx.fill()
}
function drawCoin() {
    ctx.fillStyle = "yellow"
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fill()
}
function drawExit(exit) {
    ctx.fillStyle = "green"
    ctx.beginPath()
    ctx.arc(exit.x, exit.y, 20, 0, Math.PI * 2)
    ctx.fill()
}
function drawSwitch(){
    ctx.fillStyle = "black"
    ctx.fillRect(this.x, this.y, this.width, this.height)
}
function drawSwitchRect(){
    if(switchState == this.state){
        ctx.fillStyle = "blue"
        ctx.fillRect(this.x, this.y, this.width, this.height)
    } else {
        ctx.stokeStyle = "blue"
        ctx.setLineDash([5, 5]);
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(this.x + this.width, this.y)
        ctx.lineTo(this.x + this.width, this.y + this.height)
        ctx.lineTo(this.x, this.y + this.height)
        ctx.lineTo(this.x, this.y)
        ctx.stroke()
        ctx.setLineDash([]);
    }
}