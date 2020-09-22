import { SOCKET_CONNECT } from "./constants";

const websocketInitialState = {};

export default function (state = { ...websocketInitialState }, action) {
    switch (action.type) {
        case SOCKET_CONNECT:
            return { ...state, host: action.payload.host };
        default:
            return state;
    }
};