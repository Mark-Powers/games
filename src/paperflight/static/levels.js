var levels = {
    1: {
        coinsNeeded: 5,
        exit: {
            x: 40,
            y: 460
        },
        title: "Downwards Dash",
        items: [{
            draw: drawVent,
            update: updateVent,
            x: 420,
            y: 580,
            width: 60,
            height: 600
        },
        {
            draw: drawCoin,
            update: updateCoin,
            x: 40,
            y: 80,
            radius: 10
        },
        {
            draw: drawVent,
            update: updateVent,
            x: 120,
            y: 100,
            width: 280,
            height: 100
        },
        {
            draw: drawBlock,
            update: updateBlock,
            x: 580,
            y: 200,
            width: 10,
            height: 250
        },
        {
            draw: drawCoin,
            update: updateCoin,
            x: 700,
            y: 240,
            radius: 10
        },
        {
            draw: drawCoin,
            update: updateCoin,
            x: 700,
            y: 320,
            radius: 10
        },
        {
            draw: drawCoin,
            update: updateCoin,
            x: 700,
            y: 400,
            radius: 10
        },
        {
            draw: drawRamp,
            update: updateRamp,
            x: 70,
            y: 410,
            slope: 2 / 5,
            width: 200,
            height: 10
        },
        {
            draw: drawRamp,
            update: updateRamp,
            x: 70,
            y: 470,
            slope: 2 / 5,
            width: 200,
            height: 10
        },
        {
            draw: drawCoin,
            update: updateCoin,
            x: 170,
            y: 405,
            radius: 10
        },
        {
            draw: drawRamp,
            update: updateRamp,
            x: 0,
            y: 0,
            slope: 0,
            width: 800,
            height: 40
        },
        ]
    }
}