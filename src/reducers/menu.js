import {TOGGLE_MENU, UPDATE_STATUS} from "../actions/actions";

const startState = {
    menu : {
        shown : true
    },
    status : "GAME PREPARING"
};

export default (state = startState, action) => {
    switch (action.type) {
        case TOGGLE_MENU :
            return {
                ...state,
                ...{
                    menu : {
                        shown : action.shown
                    }
                }
            };
        case UPDATE_STATUS :
            return {
                ...state,
                ...{
                    status : action.status
                }
            };
        default :
            return state;
    }
};