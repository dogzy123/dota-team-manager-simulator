
/**
 * @param {TeamManager} player
 * @param {Game}        game - not actually a valid type hint, but provides Ctrl+B at least
 * @param {Function}    game.createNotification
 * @param {Function}    game.over
 */
exports.start = function(player, game)
{
    let showMsg = (msg) => game.createNotification({title : 'News', msg : msg});

    // each following positive point shortens space between your win chance and 100% 2 times
    // i.e. 1 point = 75% win chance; 2 points = 87.5% win chance, -3 points = 6.25% win chance
    let winPoints = 0;
    let pleasurePoints = 0;
    let enemyLateGamePick = Math.random() > 0.75;
    showMsg('Enemy pick is ' + (enemyLateGamePick ? 'Late Game oriented' : 'Fast Finish oriented'));
    let enemyExperienced = Math.random() > 0.25;
    showMsg('Enemy players are ' + (enemyExperienced ? 'experienced' : 'not experienced'));

    if (confirm('Do you want to play offensive?')) {
        ++pleasurePoints;
        if (Math.random() > (enemyLateGamePick ? 0.25 : 0.75)) {
            showMsg('It paid off');
            ++winPoints;
        } else {
            showMsg('It did not pay off');
            --winPoints;
        }
    }
    if (confirm('Would you like to try some unusual pick?')) {
        ++pleasurePoints;
        if (Math.random() > (enemyExperienced ? 0.25 : 0.9)) {
            showMsg('It paid off');
            ++winPoints;
        } else {
            showMsg('It did not pay off');
            --winPoints;
        }
    }
    if (confirm('Would you like to dismorale enemies with rude chat messages?')) {
        showMsg('It paid off, but your team became a bunch of jerks.');
        ++winPoints;
    } else if (confirm('Then would you like to be polite?')) {
        if (Math.random() > 0.5) {
            showMsg('Enemy team was polite in response.');
            ++pleasurePoints;
        } else if (Math.random() > 0.5) {
            showMsg('Enemy team responded rudely.');
            --pleasurePoints;
        }
    } else {
        showMsg('So you are acting autistic then.');
    }
    if (confirm('There are some newbies in your team. Would you like to spend some time explaining them stuff?')) {
        --winPoints;
    }
    let winRate = 0.5;
    for (let i = 0; i < Math.abs(winPoints); ++i) {
        winRate = (winRate + (winPoints > 0 ? 1 : 0)) / 2;
    }
    if (Math.random() < winRate) {
        showMsg('You won, congrats!');
    } else {
        showMsg('Too bad, you lost!');
    }
};