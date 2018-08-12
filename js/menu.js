// CURRENT WINDOW
const electron = require('electron').remote;
const {Game} = require('./js/dtms');

// HTML CONSTANTS
const newGame   = $('#new-game');
const exit      = $('#exit');
const menu      = $("#menu");

newGame.on('click', () => {
    document.body.style.backgroundColor = "#000";
    document.body.style.color = "#000";

    menu.hide();

    setTimeout( () => Game.start(), 2000);
});

exit.on('click', () => electron.getCurrentWindow().close() );