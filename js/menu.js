const newGame = $('#new-game');
const exit = $('#exit');
const win = require('electron').remote.getCurrentWindow();

const bodyBgColor = document.body.style.backgroundColor;
const bodyColor = document.body.style.color;



const loadGame = () => {
    // callback for loading game

    document.body.style.backgroundColor = bodyBgColor;
    document.body.style.color = bodyColor;
    $('#game').show();
    require('../js/dtms.js');
};

newGame.on('click', () => {
    document.body.style.backgroundColor = "#000";
    document.body.style.color = "#000";
    $('#menu').hide();

    setTimeout(loadGame, 2000);
});

exit.on('click', () => {
    win.close();
});