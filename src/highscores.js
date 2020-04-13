function submitScore(game, score, username){
    // Prompt for the username
    if(username == undefined){
        username = prompt("Enter a name to submit score", "");
    }
    // If the user filled out the prompt, post the score
    if (!(username  == null || username == "")) {
        // Get a uuid to identify this request by (for idempotency)
        fetch(new Request(`/uuid`))
        .then(response => response.text()
        .then(uuid => {
            const request = new Request(`/setScore?game=${game}&username=${username}&score=${score}&uuid=${uuid}`);
            fetch(request);
        }));
        
    } 
    // Return the username for later use by the game
    return username
}