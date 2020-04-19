window.onload = function () {
    var transactionData = new Vue({
        el: '#data',
        data: {
            gameCode: "",
            username: "",
            game: undefined,
            submitText: "",
            STATES: {
                TYPING:     0,
                VOTING:     1,
                OVER:       2,
                WAITING:    3,
            },
            interval: undefined
        },
        methods: {
            startStatusLoop: function(){
                // event loop that runs while waiting for host to start
                var loadStatus = function (vue_object) {
                    fetch(new Request(`/quiz-bunny/lobby-status`))
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
                    fetch(new Request(`/quiz-bunny/game-status`))
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
                fetch(new Request(`/quiz-bunny/host-game?name=${this.username}`))
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
                fetch(new Request(`/quiz-bunny/join-game?name=${this.username}&code=${this.gameCode}`))
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
                fetch(new Request(`/quiz-bunny/start-game`))
            }, 
            submitAnswer: function(){
                fetch(new Request(`/quiz-bunny/submit?text=${this.submitText}`))
                this.submitText = ""
            },
            submitVote: function(index){
                fetch(new Request(`/quiz-bunny/vote?index=${index}`))
            },
            ready: function(index){
                fetch(new Request(`/quiz-bunny/ready`))
            },
            leave: function(index){
                clearInterval(this.interval)
                this.game = undefined
                fetch(new Request(`/quiz-bunny/leave`))
            }
        },
        created() {

        },
        computed: {

        }
    });
}