function Mountain() {
    this.name = "mountain"
}
Mountain.prototype.draw = function (x, y, size) {
    ctx.fillStyle = "gray"
    ctx.beginPath();
    ctx.moveTo(x * size + size / 2, y * size);
    ctx.lineTo(x * size, (1 + y) * (size));
    ctx.lineTo((1 + x) * (size), (1 + y) * (size));
    ctx.stroke();
    ctx.fill();
}
Mountain.prototype.update = function () {
    var event = undefined
    if(Math.random() < 0.1){
        event = function(){
            
        }
    }
    return {
        gold: 1,
        event: event
    }
}

function Forest() {
    this.name = "forest"
}
Forest.prototype.draw = function (x, y, size) {
    ctx.fillStyle = "green"
    ctx.beginPath();
    ctx.moveTo(x * size + size / 2, y * size);
    ctx.lineTo(x * size, (1 + y) * (size));
    ctx.lineTo((1 + x) * (size), (1 + y) * (size));
    ctx.stroke();
    ctx.fill();
}
Forest.prototype.update = function () {
    var event = {}
    if(Math.random() < 0.1){
        event.status = "A tree monster taks half of your"
    }
    return {
        resources: Math.floor(Math.random() * 5),
        event: event
    }
}

function Town() {
    this.name = "town"
}
Town.prototype.draw = function (x, y, size) {
    ctx.fillStyle = "brown"
    ctx.stokeStyle = "brown"
    ctx.beginPath();
    ctx.moveTo(x * size + size / 2, y * size);
    ctx.lineTo(x * size, (1 + y) * (size));
    ctx.lineTo((1 + x) * (size), (1 + y) * (size));
    ctx.stroke();
    ctx.fill();
}
Town.prototype.update = function () {
    var event = undefined
    if(Math.random() < 0.1){
        event = function(){
            
        }
    }
    return {
        population: Math.floor(Math.random() * 4) - 1,
        event: event
    }
}
