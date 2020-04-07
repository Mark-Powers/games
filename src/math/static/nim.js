var nim = {
    pieces: 10,
    buttons: [
        {
            "name": "1",
            "x": 50,
            "y": 50, 
            "width": 50, 
            "height": 50,
            "value": 1
        },
        {
            "name": "2",
            "x": 50,
            "y": 125,
            "width": 50, 
            "height": 50,
            "value": 2
        }
    ],
    status: "It is your turn",
    gameOver: false,
};
var nimSetup = false;
nim.updateCallback = function(){
    // Check for who wins/reset/etc
}
nim.drawCallback = function(){
    ctx.fillStyle = "#99b3ff";
    ctx.fillRect(0, 0, width, height);
    nim.buttons.forEach((b, i) => {
        button(b.x, b.y, 50, 50, b.name, b.isClicked);
    })

    ctx.fillStyle = "green"
    for(var i = 0; i < nim.pieces; i++){
        ctx.beginPath();
        ctx.arc(175 + i * 50, 300 + (i%2)*50, 25, 0, 2 * Math.PI);
        ctx.fill();
    }
    ctx.fillStyle = "grey"
    for(var i = nim.pieces; i < 10; i++){
        ctx.beginPath();
        ctx.arc(175 + i * 50, 300 + (i%2)*50, 25, 0, 2 * Math.PI);
        ctx.fill();
    }

    font(26)
    ctx.fillStyle = "black"
    ctx.fillText(nim.status, 175, 75)
}
nim.mouseDownCallback = function (e) {
    if(nim.gameOver){
        nim.pieces = 10;
        nim.gameOver = false;
        nim.status = "It is your turn";
        switchState(menu);
        return;
    }
    let choice = buttonAt(e.x, e.y, nim.buttons);
    if(choice){
        choice.isClicked = true;
    }
}
nim.mouseUpCallback = function (e) {
    let choice = buttonAt(e.x, e.y, nim.buttons);
    if(choice && choice.isClicked){
        nim.turn(choice.value);
    }
    nim.buttons.forEach((gameData, i) => {
        gameData.isClicked = false;
    })
}
nim.subtract = function(value){
    nim.pieces -= value;
    if(nim.pieces < 0){
        nim.pieces = 0;
    }
}
nim.turn = function(value){
    nim.subtract(value);
    if(nim.pieces == 0){
        nim.gameOver = true;
        nim.status = "You win!"
        return;
    }
    if(nim.pieces % 3 == 0){
        nim.subtract(1);
        nim.status = "The other player took 1"
    } else if(nim.pieces % 3 == 1){
        nim.subtract(1);
        nim.status = "The other player took 1"
    } else if(nim.pieces % 3 == 2){
        nim.subtract(2);
        nim.status = "The other player took 2"
    }
    if(nim.pieces == 0){
        this.gameOver = true;
        nim.status = "You lose!"
        return;
    }
}