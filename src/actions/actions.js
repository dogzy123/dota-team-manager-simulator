export const TOGGLE_MENU    = "TOGGLE_MENU";
export const UPDATE_STATUS  = "UPDATE STATUS";

export const STATUS       = {
    NEW_GAME_STATUS     : "NEW GAME",
    EXIT_GAME_STATUS    : "EXIT GAME"
};

export const toggleMenu = state => {
    return {
        type    : TOGGLE_MENU,
        shown   : state
    }
};

export const updateStatus = state => {
    return {
        type    : UPDATE_STATUS,
        status  : state
    }
};