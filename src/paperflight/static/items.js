/**
 * Contains functions to create each type of object that can
 * appear in a level. 
 */

function constructVent(x, y, width, height){
    return {
        draw: drawVent,
        update: updateVent,
        wind: [],
        x, y, width, height
    }
}
function constructCoin(x, y, radius=10){
    return {
        draw: drawCoin,
        update: updateCoin,
        collected: false,
        x, y, radius
    }
}
function constructBlock(x, y, width, height){
    return {
        draw: drawBlock,
        update: updateBlock,
        x, y, width, height
    }
}
function constructRamp(x, y, width, height, slope){
    return {
        draw: drawRamp, 
        update: updateRamp, 
        x, y, width, height, slope
    }
}
function constructSwitch(x, y, width, height, stateCount){
    return {
        draw: drawSwitch,
        update: updateSwitch,
        x, y, width, height, stateCount
    }
}
function constructRect(x, y, width, height, state){
    return{
        draw: drawSwitchRect,
        update: updateSwitchRect,
        x, y, width, height, state
    }
}