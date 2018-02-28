// HTML CONSTANTS
const newGame = $('#new-game');
const exit = $('#exit');

// CURRENT WINDOW
const electron = require('electron').remote;

const loadGame = () => {
    // callback for loading game
    require('../js/dtms.js');
};

newGame.on('click', () => {
    document.body.style.backgroundColor = "#000";
    document.body.style.color = "#000";

    $('#menu').hide();

    setTimeout(loadGame, 2000);
});

exit.on('click', () => {
    electron.getCurrentWindow().close();
});