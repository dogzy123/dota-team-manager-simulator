import Component from "../component";
import {gameManagerCreate, gameManagerPreName, STATUS} from "../actions/actions";
import {store} from "../application";
import Manager from "../manager";

export const NewGameDialog = new Component('div.container')
    .subscribe(
        new Component("div.row")
            .subscribe(
                new Component('div.col-sm-12')
                    .subscribe(
                        new Component("h3$Character")
                    )
            ),
        new Component("form.form-group row")
            .subscribe(
                new Component("div.col-sm-9")
                    .subscribe(
                        new Component("div.input-group")
                            .subscribe(
                                new Component("label.input-group-addon$Name"),
                                new Component("input.form-control")
                                    .addHandler('change', e => {
                                        store.dispatch(gameManagerPreName(e.target.value));
                                    } )
                            )
                    ),
                new Component("div.col-sm-3")
                    .subscribe(
                        new Component("button.btn btn-secondary btn-lg$OK")
                            .addHandler('click', e => {
                                store.dispatch(gameManagerCreate(new Manager(store.getState().game.preName)));
                            } )
                    )
            )
    )
    .onStateChange( (state, context) => {
        context.style.opacity = "0";

        context.classList.toggle('hidden', state.game.status !== STATUS.NEW_GAME_STATUS);

        if (state.game.status !== STATUS.PAUSED_STATUS && state.game.status !== STATUS.PREPARING)
        {
            context.style.opacity = "1";
        }
    } );