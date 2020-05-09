import {SET_TAB_INDEX} from '../actions/app';

const initialState = {
  tabIndex: 0,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_TAB_INDEX:
      const {tabIndex} = action.payload;
      return {
          ...state,
          tabIndex,
      };

    default:
      return state;
  }
}
