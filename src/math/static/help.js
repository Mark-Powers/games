var help = {
    
};
help.updateCallback = function(){
    // nothing
}
help.drawCallback = function(){
    ctx.fillStyle = "#99b3ff";
    ctx.fillRect(0, 0, width, height);
    
    font(26)
    ctx.fillStyle = "black"
    ctx.fillText("Click on a game to play.", 10, 200)
    ctx.fillText("After finishing your game, click to return.", 10, 230)
    ctx.fillText("Some games do not work perfectly. Pardon bugs.", 10, 260)
}
help.mouseDownCallback = function (e) {
    switchState(menu);
}
help.mouseUpCallback = function(e){

}