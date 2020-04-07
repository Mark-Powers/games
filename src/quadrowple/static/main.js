window.onload = function () {
    var transactionData = new Vue({
        el: '#data',
        data: {
            status: "Loading...",
            playing: false
        },
        methods: {
            newGame: function () {
                if (this.playing) {
                    fetch(new Request(`/quadrowple/new`))
                } else {
                    this.startGame()
                }
            },
            startGame: function () {
                console.log("created")
                var mouseDown = function (e) {
                    col = Math.floor(e.x / 50);
                    if (0 <= col <= 6) {
                        fetch(new Request(`/quadrowple/game/${col}`))
                    }
                }
                document.addEventListener("click", mouseDown);
                var playInterval;
                var playGame = function (t) {
                    fetch(new Request(`/quadrowple/game`)).then(response => response.json())
                        .then(response => {
                            var c = document.getElementById("canvas");
                            var ctx = c.getContext("2d");
                            ctx.fillStyle = "#eee"
                            ctx.fillRect(0, 0, 351, 301)

                            if (response.restart) {
                                t.playing = false
                                t.status = "The game has been forfeited"
                                clearInterval(playInterval)
                                return
                            } else if (response.winner != undefined) {
                                clearInterval(playInterval)
                                if (response.winner) {
                                    t.status = "You won!"
                                } else {
                                    t.status = "You lose!"
                                }
                            } else if (response.turn) {
                                t.status = "It's your turn!"
                            } else {
                                t.status = "Waiting for other player..."
                            }

                            ctx.strokeStyle = "black"
                            for (var i = 0; i <= 7; i++) {
                                ctx.moveTo(50 * i, 0);
                                ctx.lineTo(50 * i, 300);
                                ctx.stroke();
                            }
                            for (var i = 0; i <= 6; i++) {
                                ctx.moveTo(0, 50 * i);
                                ctx.lineTo(350, 50 * i);
                                ctx.stroke();
                            }

                            for (var col = 0; col < 7; col++) {
                                for (var row = 0; row < 6; row++) {
                                    if (response.game.board[col][row] == undefined) {
                                        continue
                                    } else if (response.game.board[col][row] == 0) {
                                        ctx.fillStyle = "#0000FF";
                                    } else {
                                        ctx.fillStyle = "#FF0000";
                                    }
                                    ctx.beginPath();
                                    ctx.arc(25 + 50 * col, 50 * (5 - row) + 25, 23, 0, 2 * Math.PI);
                                    ctx.fill();
                                }
                            }
                        });
                }
                var loadInterval = undefined
                var loadStatus = function (recurse, t) {
                    fetch(new Request(`/quadrowple/status`)).then(response => response.json())
                        .then(response => {
                            if (response.waiting) {
                                t.status = "Waiting..."
                                if (recurse) {
                                    loadInterval = window.setInterval(loadStatus, 1000, false, t)
                                }
                            } else {
                                t.status = "Playing..."
                                t.playing = true
                                clearInterval(loadInterval)
                                playInterval = window.setInterval(playGame, 1000, t)
                            }
                        });
                }
                loadStatus(true, this)
            }
        },
        created() {
            this.startGame();
        },
        computed: {

        }
    });
}