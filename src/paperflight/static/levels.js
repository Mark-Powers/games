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
levels[1] = createLevel("Downwards Dash", 5, 40, 460)
levels[1].items.push(
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

levels[2] = createLevel("Switch madness", 0, 40, 460)
levels[2].items.push(
    constructSwitch(120, 400, 60, 60, 3),
    constructRect(300, 400, 60, 60, 0),
    constructRect(400, 400, 60, 60, 1),
    constructRect(500, 400, 60, 60, 2),
)