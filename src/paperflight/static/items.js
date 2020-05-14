function vent(x, y, width, height){
    return {
        draw: drawVent,
        update: updateVent,
        x, y, width, height
    }
}
function coin(x, y, radius=10){
    return {
        draw: drawCoin,
        update: updateCoin,
        x, y, radius
    }
}
function block(x, y, width, height){
    return {
        draw: drawBlock,
        update: updateBlock,
        x, y, width, height
    }
}
function ramp(x, y, width, height, slope){
    return {
        draw: drawRamp, 
        update: updateRamp, 
        x, y, width, height, slope
    }
}
function getSwitch(x, y, width, height, stateCount){
    return {
        draw: drawSwitch,
        update: updateSwitch,
        x, y, width, height, stateCount
    }
}
function switchRect(x, y, width, height, state){
    return{
        draw: drawSwitchRect,
        update: updateSwitchRect,
        x, y, width, height, state
    }
}