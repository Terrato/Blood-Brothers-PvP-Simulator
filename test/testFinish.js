/**
 * Make sure that the game finishes and return the name of the winner
 */

for (var i = 0; i < 1000; i++) {
    QUnit.test("Game finishes", function(assert) {            
            assert.equal(isPlayerNameReturned(), true, "We expect the winner's name to be Player 1 or Player 2");          
    });
}

function isPlayerNameReturned() {
    BattleModel.IS_MASS_SIMULATION = true;
    BattleModel.resetAll();
    var newGame = new BattleModel({}, {p1random: true, p2random: true});
    var playerWon = newGame.startBattle();
    return (playerWon == "Player 1" || playerWon == "Player 2");
}