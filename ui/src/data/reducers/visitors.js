import {CLEAR_SUBMISSION, RECEIVE_VISITORS, TOGGLE_VISITOR_FOR_SUBMIT, SAVING_VISITOR, SAVED_VISITOR, POSTING_VISITORS_FOR_PERMIT, POSTED_VISITORS_FOR_PERMIT, SET_VISITOR_FORM_INITIAL_VALUES, SET_TAB_INDEX} from '../actions';

const initialState = {
  allVisitors: [],
  visitorsToSubmit: [],
  results: [],
  savingVisitor: false,
  visitorFormInitialValues: {},
  tabIndex: 0,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_VISITORS:
      const {json} = action.payload;
      return {
        ...state,
        allVisitors: json,
      };

    case POSTING_VISITORS_FOR_PERMIT:
      return {
        ...state,
        postingVisitorsForPermit: true,
      };

    case POSTED_VISITORS_FOR_PERMIT:
      const {results} = action.payload;
      return {
        ...state,
        postingVisitorsForPermit: false,
        results,
        visitorsToSubmit: [],
      };

    case SAVING_VISITOR:
      return {
        ...state,
        savingVisitor: true,
      };

    case SAVED_VISITOR:
      return {
        ...state,
        savingVisitor: false,
      };

    case TOGGLE_VISITOR_FOR_SUBMIT:
      const {id} = action.payload;
      if (state.visitorsToSubmit.includes(id)) {
        return {
          ...state,
          visitorsToSubmit: state.visitorsToSubmit.filter((vid) => vid !== id),
        };
      } else {
        return {
          ...state,
          visitorsToSubmit: [...state.visitorsToSubmit, id],
        };
      }

    case CLEAR_SUBMISSION:
      return {
        ...state,
        results: [],
        visitorsToSubmit: [],
      };

    case SET_VISITOR_FORM_INITIAL_VALUES:
      const {values} = action.payload;
      return {
        ...state,
        visitorFormInitialValues: values,
      };

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
