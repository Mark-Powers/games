/**
 * Creates the levels object for the game
 */
var levels = {
    2: {
        coinsNeeded: 0,
        exit: {
            x: 40,
            y: 460
        },
        title: "Switch madness",
        items: [
            constructSwitch(120, 400, 60, 60, 3),
            constructRect(300, 400, 60, 60, 0),
            constructRect(400, 400, 60, 60, 1),
            constructRect(500, 400, 60, 60, 2),
        ]
    },
    1: {
        coinsNeeded: 5,
        exit: {
            x: 40,
            y: 460
        },
        title: "Downwards Dash",
        items: [
            constructVent(420, 580, 60, 300),
            constructCoin(40, 80),
            constructVent(120, 100, 280, 100),
            constructBlock(580, 200, 10, 250),
            constructCoin(700, 240),
            constructCoin(700, 320),
            constructCoin(700, 400),
            constructRamp(70, 410, 200, 10, 2/5),
            constructRamp(70, 470, 200, 10, 2/5),
            constructCoin(170, 405),
            constructBlock(0, 0, 800, 40)
        ]
    }
}