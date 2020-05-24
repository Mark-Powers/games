window.onload = function () {
    var transactionData = new Vue({
        el: '#data',
        data: {
            gameCode: "",
            username: "",
            game: undefined,
            submitText: "",
            STATES: {
                GUESSING: 0,
                WAITING: 1,
                OVER: 2
            },
            interval: undefined
        },
        methods: {
            nonReady: function (players) {
                return players.filter(player => !player.ready)
              },
            startStatusLoop: function(){
                // event loop that runs while waiting for host to start
                var loadStatus = function (vue_object) {
                    fetch(new Request(`/trivia/lobby-status`))
                        .then(response => response.json())
                        .then(response => {
                            if (response.message) {
                                console.log(response.message)
                            } else if(response.gameStarted){
                                clearInterval(vue_object.interval)
                                vue_object.startGameLoop()

                            } else { // Just update game object with new players
                                vue_object.game = response
                            }
                        });
                    
                }
                this.interval = window.setInterval(loadStatus, 1000, this)
            },
            startGameLoop: function(){
                var loadStatus = function (vue_object) {
                    fetch(new Request(`/trivia/game-status`))
                        .then(response => response.json())
                        .then(response => {
                            if (response.message) {
                                console.log(response.message)
                            } else { 
                                vue_object.game = response
                            }
                        });
                    
                }
                this.interval = window.setInterval(loadStatus, 1000, this)
            },
            hostGame: function () {
                fetch(new Request(`/trivia/host-game?name=${this.username}`))
                    .then(response => response.json())
                    .then(response => {
                        if (response.message) {
                            console.log(response.message)
                        } else {
                            this.game = response
                            this.startStatusLoop()
                        }
                    })
            },
            joinGame: function () {
                fetch(new Request(`/trivia/join-game?name=${this.username}&code=${this.gameCode}`))
                    .then(response => response.json())
                    .then(response => {
                        if (response.message) {
                            console.log(response.message)
                        } else {
                            this.game = response
                            this.startStatusLoop()
                        }
                    })
            },
            startGame: function () {
                fetch(new Request(`/trivia/start-game`))
            }, 
            submitQuestion: function(){
                fetch(new Request(`/trivia/submit?text=${this.submitText}`))
                this.submitText = ""
            },
            buzzIn: function(){
                console.log("buz")
                fetch(new Request(`/trivia/buzz`))
            },
            endRound: function(){
                console.log("endround")
                fetch(new Request(`/trivia/endRound`))
            },
            endQuestion: function(){
                console.log("endquestion")
                fetch(new Request(`/trivia/endQuestion`))
            },
            giveScore: function(index, score){
                fetch(new Request(`/trivia/giveScore?index=${index}&points=${score}`))
            }
        },
        created() {

        },
        computed: {

        }
    });
}