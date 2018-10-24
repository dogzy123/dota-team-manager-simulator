import {STATUS, CREATE_GAME_MANAGER, UPDATE_GAME_MANAGER, UPDATE_GAME_STATUS} from "../actions/actions";

const startState = {
    manager : {},
    status  : STATUS.PREPARING
};

export default (state = startState, action) => {
    switch (action.type) {
        case UPDATE_GAME_STATUS :
            return {
                ...state,
                ...{
                    status  : action.status
                }
            };
        case CREATE_GAME_MANAGER :
            return {
                ...state,
                ...{
                    status  : STATUS.PLAYING,
                    manager : action.manager
                }
            };
        case UPDATE_GAME_MANAGER :
            return {
                ...state,
                ...{
                    manager : {
                        ...action.props
                    }
                }
            };
        default :
            return state;
    }
};