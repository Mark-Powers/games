var black_hole = {
    status: "",
    state: -1,
    rowOf: {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 1,
        7: 1,
        8: 1,
        9: 1,
        10: 1,
        11: 2,
        12: 2,
        13: 2,
        14: 2,
        15: 3,
        16: 3,
        17: 3,
        18: 4,
        19: 4,
        20: 5,
    },
    colOf: {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 0,
        7: 1,
        8: 2,
        9: 3,
        10: 4,
        11: 0,
        12: 1,
        13: 2,
        14: 3,
        15: 0,
        16: 1,
        17: 2,
        18: 0,
        19: 1,
        20: 0,
    },
    canPlay: function (index) {
        return this.board[index] == undefined
    },
    setup: function () {
        this.board = [];
        for(var i =0; i < 21; i++){
            this.board.push(undefined);
        }
        this.turn = 1
    },

    play: function () {
        
    },
    other_play: function () {
        var madePlay = false
        while (!madePlay) {
            // guess random
            var index = Math.floor(Math.random() * 21)
            if(this.canPlay(index)){
                black_hole.board[index] = {
                    "color": "blue", 
                    "value": Math.ceil(black_hole.turn / 2)
                }
                black_hole.turn++
                madePlay = true
            }
        }

    },
};
black_hole.updateCallback = function () {
    if(black_hole.turn == 21 && black_hole.state < 2) {
        black_hole.state = 2
    }

    if (black_hole.state == -1){ // setup
        black_hole.setup();
        black_hole.state = 0
    } else if (black_hole.state == 0) { // player turn
        // nothing, wait for click
    } else if (black_hole.state == 1) { // other turn
        black_hole.other_play();
        black_hole.state = 0
    } else if (black_hole.state == 2) { // calculate end
        score = {"blue": 0, "red": 0}
        black_hole.board.forEach((spot, i) => {
            if(spot == undefined){
                var row = black_hole.rowOf[i];
                var col = black_hole.colOf[i];
                black_hole.board.forEach((other_spot, j) => {
                    var row2 = black_hole.rowOf[j];
                    var col2 = black_hole.colOf[j]; 
                    if(other_spot != undefined &&
                        (
                            (row == row2-1 && 0 <= (col - col2) && (col - col2) <= 1) ||
                            (row == row2 && Math.abs(col - col2) <= 1) ||
                            (row == row2+1 &&  0 <= (col2 - col) && (col2 - col) <= 1)
                        )
                    ){
                            score[other_spot.color] += other_spot.value
                        }
                })
            }
        })
        black_hole.score = score
        if(score.red < score.blue){
            black_hole.winner = "red"
        } else {
            black_hole.winner = "blue"
        }
        black_hole.state = -1;
        switchState(menu);
    }
}
black_hole.drawCallback = function () {
    if(black_hole.state < 0){
        return;
    }
    ctx.fillStyle = "#99b3ff";
    ctx.fillRect(0, 0, width, height);

    
    ctx.lineWidth = 2;
    black_hole.board.forEach((spot, i) => {
        var row = black_hole.rowOf[i];
        var col = black_hole.colOf[i];
        if(spot == undefined){
            ctx.fillStyle = "black";
            ctx.strokeStyle = "black"
        } else {
            ctx.fillStyle = spot["color"];
            ctx.strokeStyle = spot["color"]
            ctx.fillText(spot["value"], 100 + row * 100 + col * 50, 100 + col*88)
        }
        ctx.beginPath();
        ctx.arc(100 + row * 100 + col * 50, 100 + col*88, 50, 0, 2 * Math.PI);
        ctx.stroke(); 
    })

    if(black_hole.winner){
        font(32);
        ctx.fillStyle = "black";
        ctx.fillText(black_hole.winner + " wins!", 550, 330)
        ctx.fillText("red: " + black_hole.score.red, 550, 370)
        ctx.fillText("blue: " + black_hole.score.blue, 550, 410)
    }
}
black_hole.mouseDownCallback = function (e) {
    if(black_hole.state == 3){
        return;
    }

    black_hole.board.forEach((spot, i) => {
        var row = black_hole.rowOf[i];
        var col = black_hole.colOf[i];
        var x = 100 + row * 100 + col * 50;
        var y = 100 + col*88;
        if(spot == undefined && Math.sqrt(Math.pow(x - e.x, 2) + Math.pow(y - e.y, 2)) < 50){
            console.log(i);
            black_hole.board[i] = {
                "color": "red", 
                "value": Math.ceil(black_hole.turn / 2)
            }
            black_hole.turn++;
            black_hole.state = 1
        }
    })
}
black_hole.mouseUpCallback = function (e) {

}