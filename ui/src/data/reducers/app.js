import { SET_TAB_INDEX } from "../actions/app";

const initialState = {
  tabIndex: 0,
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

    default:
      return state;
  }
}
