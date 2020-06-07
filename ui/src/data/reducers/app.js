import { v4 as uuid4 } from "uuid";
import { SET_TAB_INDEX, REMOVE_TOAST, SHOW_TOASTS } from "../actions/app";

const initialState = {
  tabIndex: 0,
  toasts: [],
};

/**
 * Reducer for app data store
 *
 * @param {object} state=initialState Initial state of app data store
 * @param {string} action Action to perform
 * @return {object} New state
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case SET_TAB_INDEX:
      const { tabIndex } = action.payload;
      return {
        ...state,
        tabIndex,
      };

    case REMOVE_TOAST: {
      const { id } = action.payload;
      const toasts = state.toasts.filter((toast) => toast.id !== id);
      return {
        ...state,
        toasts,
      };
    }

    case SHOW_TOASTS: {
      let { toasts } = action.payload;

      toasts = toasts.map((toast) => ({
        id: uuid4(),
        ...toast,
      }));

      return {
        ...state,
        toasts,
      };
    }

    default:
      return state;
  }
}
