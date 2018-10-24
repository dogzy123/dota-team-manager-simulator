export const UPDATE_GAME_STATUS     = "UPDATE GAME STATUS";
export const CREATE_GAME_MANAGER    = "CREATE GAME MANAGER";
export const UPDATE_GAME_MANAGER    = "UPDATE GAME MANAGER";

export const STATUS       = {
    NEW_GAME_STATUS     : "NEW GAME",
    EXIT_GAME_STATUS    : "EXIT GAME",
    PAUSED_STATUS       : "PAUSED",
    PLAYING             : "PLAYING",
    PREPARING           : "GAME PREPARING",
    TOGGLE_PAUSE        : "TOGGLE PAUSE"
};

export const gameStatus = status => {
    return {
        type        : UPDATE_GAME_STATUS,
        status      : status
    }
};

export const gameManagerCreate = manager => {
    return {
        type        : CREATE_GAME_MANAGER,
        manager     : manager
    }
};

export const gameManagerUpdate = props => {
    return {
        type        : UPDATE_GAME_MANAGER,
        props       : props
    }
};