import {combineReducers, createStore} from "redux";
import gameReducer  from "./reducers/game";
import {onStateUpdateEvents, preload} from "./utils";

const dtmsApp = combineReducers({
    game    : gameReducer
});

export const store = createStore(dtmsApp);

preload();

store.subscribe( () => {
    // debug in console
    console.log(store.getState());

    onStateUpdateEvents();
} );

console.log(store.getState());