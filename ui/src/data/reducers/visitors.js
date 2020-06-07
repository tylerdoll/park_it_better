import {
  CLEAR_SUBMISSION,
  RECEIVE_VISITORS,
  TOGGLE_VISITOR_FOR_SUBMIT,
  SAVING_VISITOR,
  SAVED_VISITOR,
  POSTING_VISITORS_FOR_PERMIT,
  POSTED_VISITORS_FOR_PERMIT,
  SET_VISITOR_FORM_INITIAL_VALUES,
  CLEAR_VISITORS_TO_SUBMIT,
  MARK_INVALID_VISITORS,
  OPEN_DELETE_VISITOR_DIALOG,
  CLOSE_DELETE_VISITOR_DIALOG,
} from "../actions/visitors";

const initialState = {
  allVisitors: [],
  visitorsToSubmit: [],
  invalidVisitors: [],
  saving: false,
  postingForPermit: false,
  deleteVisitorDialog: {
    isOpen: false,
    visitorId: null,
  },
  visitorFormInitialValues: {
    fullName: "",
    email: "email@address.com",
    phone: "",
    address: "n/a",
    unit: "n/a",
    city: "n/a",
    zip: "n/a",
    vehicleColor: "",
    vehicleYear: new Date().getFullYear(),
    vehicleMake: "",
    vehicleModel: "",
    vehiclePlate: "",
    vehicleState: "CO",
  },
};

/**
 * Reducer for the visitors data store
 *
 * @param {Object} state=initialState Inital state of data store
 * @param {string} action Action to perform
 * @return {Object} New state
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_VISITORS:
      const { json } = action.payload;
      return {
        ...state,
        invalidVisitors: [],
        allVisitors: json,
      };

    case POSTING_VISITORS_FOR_PERMIT:
      return {
        ...state,
        postingForPermit: true,
      };

    case POSTED_VISITORS_FOR_PERMIT: {
      return {
        ...state,
        postingForPermit: false,
      };
    }

    case CLEAR_VISITORS_TO_SUBMIT: {
      return {
        ...state,
        visitorsToSubmit: [],
      };
    }

    case MARK_INVALID_VISITORS: {
      const { results } = action.payload;

      const invalidVisitors = results
        .filter((result) => !result.succeeded)
        .map((result) => result.visitor["_id"]);

      return {
        ...state,
        invalidVisitors,
      };
    }

    case SAVING_VISITOR:
      return {
        ...state,
        saving: true,
      };

    case SAVED_VISITOR:
      return {
        ...state,
        saving: false,
      };

    case TOGGLE_VISITOR_FOR_SUBMIT:
      const { id } = action.payload;
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
      const { values } = action.payload;
      return {
        ...state,
        visitorFormInitialValues: values,
      };

    case OPEN_DELETE_VISITOR_DIALOG: {
      const { visitorId } = action.payload;
      const deleteVisitorDialog = {
        ...state.deleteVisitorDialog,
        isOpen: true,
        visitorId,
      };
      return {
        ...state,
        deleteVisitorDialog,
      };
    }

    case CLOSE_DELETE_VISITOR_DIALOG: {
      const deleteVisitorDialog = {
        ...state.deleteVisitorDialog,
        isOpen: false,
        visitorId: null,
      };
      return {
        ...state,
        deleteVisitorDialog,
      };
    }

    default:
      return state;
  }
}
