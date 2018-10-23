import {createStore} from "redux";
import menuReducer from "./reducers/menu";
import {toggleMenu} from "./actions/actions";
import {MenuBlock} from "./components/constants";
import {Menu} from "./components/menu";
import {EXIT_GAME_STATUS} from "./actions/statuses";

export const store = createStore(menuReducer);

const remote = window.require('electron').remote;

store.subscribe( () => {
    // debug in console
    console.log(store.getState());

    Menu.render(store.getState());

    if (store.getState().status === EXIT_GAME_STATUS)
    {
        remote.getCurrentWindow().close();
    }
} );

document.body.addEventListener('keydown', function (e) {
    if (e.keyCode === 27)
    {
        store.dispatch(toggleMenu(!store.getState().menu.shown))
    }
});

MenuBlock.appendChild(
    Menu.getContext()
);