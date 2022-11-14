import {dispatch} from "use-bus";

export const AXES_HELPER_ON = "AXES_HELPER_ON"
export const AXES_HELPER_OFF = "AXES_HELPER_OFF"
export const ANIMATION_ADD = "ANIMATION_ADD"

export default class ViewerEvent {

    static addAxesHelper(id) {
        this.#send(AXES_HELPER_ON, id, {})
    }
    static removeAxesHelper(id) {
        this.#send(AXES_HELPER_OFF, id, {})
    }
    static #send(eventName, id, payload) {
        dispatch({type: eventName, id: id, payload: payload})
    }

    static addAnimation(id, object, frameName, animation) {
        this.#send(
            ANIMATION_ADD,
            id,
            {
                name: frameName,
                obj: object,
                animation: animation
            }
        )
    }
}

