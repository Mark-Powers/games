function submitScore(game, score, username){
    if(username == undefined){
        username = prompt("Enter a name to submit score", "");
    }
    if (!(username  == null || username == "")) {
        const request = new Request(`/setScore?game=${game}&username=${username}&score=${score}`);
        fetch(request);
    } 
    return username
}