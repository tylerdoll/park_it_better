import { RECEIVE_HISTORY } from "../actions/history";

const initialState = {
  permitHistory: [],
};

/**
 * Reducer for data store
 *
 * @param {object} state=initialState Initial state of data store
 * @param {string} action Action to perform
 * @return {object} New state
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_HISTORY: {
      const { permitHistory } = action.payload;
      return {
        ...state,
        permitHistory,
      };
    }

    default:
      return state;
  }
}
