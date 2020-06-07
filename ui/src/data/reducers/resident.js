import {
  SAVING_RESIDENT,
  SAVED_RESIDENT,
  RECEIVE_RESIDENT,
} from "../actions/resident";

const initialState = {
  saving: false,
  fields: {
    property: "",
    fullName: "",
    address: "",
    unit: "",
    city: "",
    state: "",
    zip: "",
  },
};

/**
 * Reducer for resident data store
 *
 * @param {object} state=initialState Initial state of data store
 * @param {string} action Action to perform
 * @return {object} New state
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case SAVING_RESIDENT:
      return {
        ...state,
        saving: true,
      };

    case SAVED_RESIDENT:
      return {
        ...state,
        saving: false,
      };

    case RECEIVE_RESIDENT:
      const { fields } = action.payload;
      return {
        ...state,
        fields,
      };

    default:
      return state;
  }
}
