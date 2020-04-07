var kings_corner = {
    suit_color: {
        "C": "black",
        "S": "black",
        "H": "red",
        "D": "red"
    },
    value_to_num: {
        "A": 0,
        "2": 1,
        "3": 2,
        "4": 3,
        "5": 4,
        "6": 5,
        "7": 6,
        "8": 7,
        "9": 8,
        "10": 9,
        "J": 10,
        "Q": 11,
        "K": 12
    },
    selected: [],
    selected_positions: [],
    status: "",
    state: -1,
    shuffle: function (a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    },
    canBePlayedOn: function (bottom, top, board_position) {
        if (top == undefined) {
            return false;
        }
        if (bottom == undefined) {
            return top.value == "K" || board_position < 4;
        }
        if (this.suit_color[bottom.suit] != this.suit_color[top.suit]) {
            return this.value_to_num[bottom.value] - this.value_to_num[top.value] == 1;
        } else {
            return false;
        }
    },
    findBoardPosition(cards) {
        var board_position;
        for (var index = 0; index < this.board.length; index++) {
            if (this.board[index] == cards) {
                board_position = index;
            }
        }
        return board_position
    },
    canPlayBoardHand: function (cards, hand) {
        var bottom = cards[cards.length - 1];
        var board_position = this.findBoardPosition(cards);
        return this.canBePlayedOn(bottom, hand, board_position)
    },
    canPlay: function () {
        if (this.selected_positions[0] == "board"
            && this.selected_positions[1] == "hand") {
            return this.canPlayBoardHand(this.selected[0], this.selected[1])
        } else if (this.selected_positions[1] == "board"
            && this.selected_positions[0] == "hand") {
            return this.canPlayBoardHand(this.selected[1], this.selected[0])
        } else if (this.selected_positions[0] == "board"
            && this.selected_positions[1] == "board") {

            var cards1 = this.selected[1];
            var cards2 = this.selected[0];
            var top = cards1[0]
            var bottom = cards2[cards2.length - 1]
            var board_position = this.findBoardPosition(cards2);
            if (this.canBePlayedOn(bottom, top, board_position)) {
                return true;
            }
            top = cards2[0]
            bottom = cards1[cards1.length - 1]
            board_position = this.findBoardPosition(cards1);
            if (this.canBePlayedOn(bottom, top, board_position)) {
                return true;
            }
        }
        return false;
    },
    setup: function () {
        this.deck = [];
        Object.keys(this.value_to_num).forEach((value) => {
            Object.keys(this.suit_color).forEach((suit) => {
                kings_corner.deck.push({ suit: suit, value: value });
            })
        })
        this.shuffle(this.deck);
        this.board = [[this.deck.pop()], [this.deck.pop()],
        [this.deck.pop()], [this.deck.pop()],
        [], [], [], []]
        this.hand = []
        this.other_hand = []
        for (var i = 0; i < 7; i++) {
            this.hand.push(this.deck.pop());
            this.other_hand.push(this.deck.pop());
        }
        this.hand.push(this.deck.pop());
    },
    removeCard: function (arr, c) {
        return arr.filter((card) => {
            return !(card.value == c.value && card.suit == c.suit);
        })
    },
    play: function () {
        if (this.selected.length != 2) {
            this.state = 1
        } else if (this.canPlay()) {
            if (this.selected_positions[0] == "board" && this.selected_positions[1] == "hand") {
                var cards = this.selected[0];
                var top = this.selected[1];
                cards.push(top);
                this.hand = this.removeCard(this.hand, top)
            } else if (this.selected_positions[1] == "board" && this.selected_positions[0] == "hand") {
                var cards = this.selected[1];
                var top = this.selected[0];
                cards.push(top);
                this.hand = this.removeCard(this.hand, top)
            } else if (this.selected_positions[0] == "board" && this.selected_positions[1] == "board") {
                var cards1 = this.selected[1];
                var cards2 = this.selected[0];
                var top = cards1[0]
                var bottom = cards2[cards2.length - 1]
                var board_position = this.findBoardPosition(cards2);
                if (this.canBePlayedOn(bottom, top, board_position)) {
                    while (this.selected[1].length > 0) {
                        this.selected[0].push(this.selected[1].shift());
                    }
                    return;
                }
                top = cards2[0]
                bottom = cards1[cards1.length - 1]
                board_position = this.findBoardPosition(cards1);
                if (this.canBePlayedOn(bottom, top, board_position)) {
                    while (this.selected[0].length > 0) {
                        this.selected[1].push(this.selected[0].shift());
                    }
                    return;
                }
            }
        } else {
            console.log("no play")
        }
    },
    other_play: function () {
        var madePlay = true
        var playedCards = [];
        while (madePlay && this.other_hand.length > 0) {
            madePlay = false;
            for (var i = 0; i < this.other_hand.length; i++) {
                let card = this.other_hand[i]
                for (var index = 0; index < this.board.length; index++) {
                    var top = card;
                    var cards = this.board[index];
                    var bottom = cards[cards.length - 1];
                    if (this.canBePlayedOn(bottom, top, index)) {
                        cards.push(card);
                        this.other_hand = this.removeCard(this.other_hand, card)
                        playedCards.push(card);
                        console.log(madePlay)
                        madePlay = true
                        break;
                    }

                }
                if (madePlay) {
                    break;
                }
            }
            for (var index1 = 0; index1 < this.board.length; index1++) {
                for (var index2 = 0; index2 < this.board.length; index2++) {
                    var cards1 = this.board[index1];
                    var cards2 = this.board[index2];
                    var top = cards1[0]
                    var bottom = cards2[cards2.length - 1]
                    var board_position = this.findBoardPosition(cards2);
                    if (index1 >= 4) {
                        continue
                        // dont move a king to the left
                    }
                    if (this.canBePlayedOn(bottom, top, board_position)) {
                        while (cards1.length > 0) {
                            cards2.push(cards1.shift());
                        }
                        break;
                    }
                }
            }
        }

        if (playedCards.length == 0) {
            this.status = "They played nothing"
        } else {
            this.status = "They played "
            for (var index = 0; index < playedCards.length - 1; index++) {
                this.status += `${playedCards[index].value} of ${playedCards[index].suit}, `
            }
            this.status += `${playedCards[playedCards.length - 1].value} of ${playedCards[playedCards.length - 1].suit}`
        }
    },
};
kings_corner.updateCallback = function () {
    if (kings_corner.state == -1){ // setup
        kings_corner.setup();
        kings_corner.state = 0
    } else if (kings_corner.state == 0) { // player turn
        if (kings_corner.hand.length == 0) {
            kings_corner.status = "You win!"
            kings_corner.state = 2
            return;
        }
    } else if (kings_corner.state == 1) { // other turn
        kings_corner.other_hand.push(kings_corner.deck.pop());
        kings_corner.other_play();
        if (kings_corner.other_hand.length == 0) {
            kings_corner.status = "You lose!"
            kings_corner.state = 3
            return;
        }
        kings_corner.state = 0
        kings_corner.hand.push(kings_corner.deck.pop());
    } else if (kings_corner.state == 2 || kings_corner.state == 3) { 
        // nothing
    }
}
kings_corner.drawCallback = function () {
    if(kings_corner.state < 0){
        return;
    }
    ctx.fillStyle = "#99b3ff";
    ctx.fillRect(0, 0, width, height);

    font(26)
    ctx.fillStyle = "lime";
    ctx.fillRect(5, 5, 90, 40);
    ctx.fillStyle = "black"
    if (kings_corner.selected.length != 2) {
        ctx.fillText("Pass", 10, 30);
    } else {
        ctx.fillText("Play", 10, 30);
    }

    ctx.fillStyle = "black"
    ctx.fillText("You", 10, 240)
    kings_corner.hand.forEach((card, i) => {
        if (kings_corner.selected.includes(card)) {
            ctx.fillStyle = "#CCC"
        } else {
            ctx.fillStyle = "white";
        }
        ctx.fillRect(i * 75 + 100, 210, 70, 120);
        ctx.fillStyle = kings_corner.suit_color[card.suit]
        ctx.fillText(card.suit, i * 75 + 105, 250)
        ctx.fillText(card.value, i * 75 + 105, 230)
    })

    ctx.fillStyle = "black"
    ctx.fillText("Other", 10, 360)
    kings_corner.other_hand.forEach((card, i) => {
        ctx.fillStyle = "blue"
        ctx.fillRect(i * 75 + 100, 340, 70, 120);
    })

    ctx.fillStyle = "black"
    ctx.fillText(kings_corner.status, 100, 500)

    ctx.fillStyle = "black"
    ctx.fillText("Board", 10, 120)
    kings_corner.board.forEach((cards, i) => {
        if (kings_corner.selected.includes(cards)) {
            ctx.fillStyle = "#CCC"
        } else {
            ctx.fillStyle = "white";
        }
        ctx.fillRect(i * 75 + 100, 80, 70, 120);
        ctx.fillStyle = "black"
        // var card = kings_corner.board[i];
        var top = cards[cards.length - 1];
        var bottom = cards[0];
        if (top != undefined) {
            ctx.fillStyle = kings_corner.suit_color[top.suit]
            ctx.fillText(top.suit, i * 75 + 105, 160)
            ctx.fillText(top.value, i * 75 + 105, 180)

            if (top != bottom) {
                ctx.fillStyle = kings_corner.suit_color[bottom.suit]
                ctx.fillText(bottom.suit, i * 75 + 105, 120)
                ctx.fillText(bottom.value, i * 75 + 105, 100)
            }
        }
    })
    if(kings_corner.state >= 2){
        kings_corner.state = -1;
        switchState(menu);
    }
}
kings_corner.mouseDownCallback = function (e) {
    if(kings_corner.state != 0){
        return;
    }

    if (5 < e.x && e.x < 95 && 5 < e.y && e.y < 95) {
        kings_corner.play();
        return
    }

    var new_selected = false
    kings_corner.hand.forEach((card, i) => {
        if (i * 75 + 100 < e.x && e.x < i * 75 + 170 &&
            210 < e.y && e.y < 330) {

            kings_corner.selected.unshift(card);
            if (kings_corner.selected.length > 2) {
                kings_corner.selected.pop();
            }
            kings_corner.selected_positions.unshift("hand");
            if (kings_corner.selected_positions.length > 2) {
                kings_corner.selected_positions.pop();
            }
            new_selected = true
        }
    })

    kings_corner.board.forEach((cards, i) => {
        if (i * 75 + 100 < e.x && e.x < i * 75 + 170 &&
            80 < e.y && e.y < 200) {

            kings_corner.selected.unshift(cards);
            if (kings_corner.selected.length > 2) {
                kings_corner.selected.pop();
            }
            kings_corner.selected_positions.unshift("board");
            if (kings_corner.selected_positions.length > 2) {
                kings_corner.selected_positions.pop();
            }
            new_selected = true
        }
    })

    if (!new_selected) {
        kings_corner.selected = []
        kings_corner.selected_positions = []
    }
}
kings_corner.mouseUpCallback = function (e) {

}