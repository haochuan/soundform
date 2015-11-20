import reactor from './reactor';
import {
    PLAY,
    STOP,
    CHNAGE_TYPE,
    CHNAGE_FREQ,
    DRAW_TIMEDOMAIN,
    DRAW_FREQDOMAIN
} from './actionTypes';

export default {
    toggle(status) {
        if (status === 1) {
            reactor.dispatch(PLAY, {});
        } else {
            reactor.dispatch(PLAY, {});
        }
    }
}