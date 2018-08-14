// CURRENT WINDOW
const electron = require('electron').remote;
const {Game, Manager} = require('./js/dtms');

// HTML CONSTANTS
const menu             = $("#menu");
const characterButton  = $('#create-character');
const characterInput   = $('#inlineFormInputGroup');
const characterDialog  = $('#create-form');
const game             = $("#game");
const continueBtn      = $("#continue");
const newGameBtn       = $('#new-game');
const exitBtn          = $('#exit');

continueBtn.on('click', () => {
    Game.unpause();
    game.show();
    menu.hide();
} );

newGameBtn.on('click', () => {
    document.body.style.backgroundColor = "#000";
    document.body.style.color = "#000";

    menu.hide();

    setTimeout( () => Game.start(), 2000);
});

exitBtn.on('click', () => electron.getCurrentWindow().close() );

characterInput.on('keydown', e => {
    if (e.keyCode === 13)
    {
        characterButton.focus();
    }
});

characterButton.on('click', e => {
    characterInput.removeClass('form-control-danger');
    characterInput.parent().removeClass('has-danger');

    characterDialog.hide();

    setTimeout( () => {
        document.body.style.backgroundColor = "rgba(3, 8, 16, 0.75)";
        document.body.style.color = "azure";
        game.show();

        Game.init(new Manager( characterInput.val() ));
    }, 2000);
});
