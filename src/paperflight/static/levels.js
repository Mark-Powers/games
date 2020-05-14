var levels = {
    2: {
        coinsNeeded: 0,
        exit: {
            x: 40,
            y: 460
        },
        title: "Switch madness",
        items: [
            getSwitch(120, 400, 60, 60, 3),
            switchRect(300, 400, 60, 60, 0),
            switchRect(400, 400, 60, 60, 1),
            switchRect(500, 400, 60, 60, 2),
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
            vent(420, 580, 60, 600),
            coin(40, 80),
            vent(120, 100, 280, 100),
            block(580, 200, 10, 250),
            coin(700, 240),
            coin(700, 320),
            coin(700, 400),
            ramp(70, 410, 200, 10, 2/5),
            ramp(70, 470, 200, 10, 2/5),
            coin(170, 405),
            block(0, 0, 800, 40)
        ]
    }
}