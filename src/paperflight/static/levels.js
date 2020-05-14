/**
 * Creates the levels object for the game
 */
function createLevel(title, coinsNeeded, exitX, exitY) {
    return {
        items: [constructBlock(0, 0, 800, 30)],
        exit: {
            x: exitX,
            y: exitY,
            radius: 20
        },
        title, coinsNeeded
    }
}
var levels = {}
levels[1] = createLevel("Welcome", 0, 400, 250)
levels[1].items.push(
    constructText(30, 60, "Use left and right to fly into the exit", "30px Courier")
)

levels[2] = createLevel("Controls!", 0, 400, 250)
levels[2].items.push(
    constructText(30, 60, "Press down or up to change speed", "30px Courier")
)

levels[3] = createLevel("Coins!", 1, 400, 250)
levels[3].items.push(
    constructText(30, 60, "Collect the needed coins to continue", "30px Courier"),
    constructCoin(400, 200)
)

levels[4] = createLevel("Getting harder...", 0, 700, 200)
levels[4].items.push(
    constructText(30, 60, "Avoid walls, use the vent", "30px Courier"),
    constructBlock(600, 120, 10, 500),
    constructVent(500, 550, 90, 600)
)

levels[5] = createLevel("Downwards Dash", 5, 40, 460)
levels[5].items.push(
    constructVent(420, 580, 60, 600),
    constructCoin(40, 80),
    constructVent(120, 100, 280, 100),
    constructBlock(580, 200, 10, 250),
    constructCoin(700, 240),
    constructCoin(700, 320),
    constructCoin(700, 400),
    constructRamp(70, 400, 200, 10, 2 / 5),
    constructRamp(70, 480, 200, 10, 2 / 5),
    constructCoin(170, 405),
)

levels[6] = createLevel("Switch madness", 0, 40, 460)
levels[6].items.push(
    constructSwitch(120, 400, 60, 60, 3),
    constructRect(300, 400, 60, 60, 0),
    constructRect(400, 400, 60, 60, 1),
    constructRect(500, 400, 60, 60, 2),
)