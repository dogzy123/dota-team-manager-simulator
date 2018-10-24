import {gameStatus, STATUS} from "./actions/actions";
import {MenuBlock, CreateCharacterBlock} from "./components/constants";
import {Menu} from "./components/menu";
import {store} from "./application";
import {NewGameDialog} from "./components/new_game_dialog";

const remote = window.require('electron').remote;

export const onStateUpdateEvents = () => {
    // menu render
    Menu.render(store.getState());
    NewGameDialog.render(store.getState());

    if (store.getState().game.status === STATUS.EXIT_GAME_STATUS)
    {
        remote.getCurrentWindow().close();
    }

    if (store.getState().game.status === STATUS.NEW_GAME_STATUS)
    {
        document.body.style.backgroundColor = "#000";
        document.body.style.color = "#000";
    }
};

export const PreLoadedEvents = () => {
    Menu.render(store.getState());
    NewGameDialog.render(store.getState());

    // menu toggling
    document.body.addEventListener('keydown', e => {
        if (e.keyCode === 27)
        {
            if (store.getState().game.status !== STATUS.PREPARING)
            {
                const status = store.getState().game.status === STATUS.PAUSED_STATUS ? STATUS.PLAYING : STATUS.PAUSED_STATUS;
                store.dispatch(gameStatus(status));
            }
        }
    });
};

export const PreLoadedDom = () => {
    // menu context
    MenuBlock.appendChild(
        Menu.getContext()
    );

    CreateCharacterBlock.appendChild(
        NewGameDialog.getContext()
    );
};

export const preload = () => {
    PreLoadedEvents();
    PreLoadedDom();
};