import Component from "../component";
import {store} from "../application";
import {gameStatus, STATUS} from "../actions/actions";

const ContinueBtn = new Component('button.btn btn-secondary btn-lg btn-block$Continue')
    .addHandler( 'click', e => {
        store.dispatch(gameStatus(STATUS.PLAYING));
    } );
const NewGameBtn  = new Component('button.btn btn-secondary btn-lg btn-block$New Game')
    .addHandler( 'click', e => {
        store.dispatch(gameStatus(STATUS.NEW_GAME_STATUS));
    } );

const ExitBtn     = new Component('button.btn btn-secondary btn-lg btn-block$Exit')
    .addHandler( 'click', e => {
        store.dispatch(gameStatus(STATUS.EXIT_GAME_STATUS));
    } );

export const Menu = new Component("div.container")
    .subscribe(
        new Component("div.row")
            .subscribe(
                new Component("div.col-sm-12")
                    .subscribe(
                        ContinueBtn,
                        NewGameBtn,
                        ExitBtn
                    )
            )
    )
    .onStateChange( (state, context) => {
        context.classList.toggle('hidden', state.game.status !== STATUS.PAUSED_STATUS && state.game.status !== STATUS.PREPARING);
    } );