import { v4 as uuid4 } from "uuid";

import {
  CLEAR_SUBMISSION,
  RECEIVE_VISITORS,
  TOGGLE_VISITOR_FOR_SUBMIT,
  SAVING_VISITOR,
  SAVED_VISITOR,
  POSTING_VISITORS_FOR_PERMIT,
  POSTED_VISITORS_FOR_PERMIT,
  SET_VISITOR_FORM_INITIAL_VALUES,
  REMOVE_TOAST,
  CLEAR_VISITORS_TO_SUBMIT,
  SHOW_TOASTS,
  MARK_INVALID_VISITORS,
  OPEN_DELETE_VISITOR_DIALOG,
  CLOSE_DELETE_VISITOR_DIALOG,
} from "../actions/visitors";

const initialState = {
  history: [],
  allVisitors: [],
  visitorsToSubmit: [],
  invalidVisitors: [],
  toasts: [],
  saving: false,
  deleteVisitorDialog: {
    isOpen: false,
    visitorId: null,
  },
  visitorFormInitialValues: {
    "visitor-first-name": "",
    "visitor-last-name": "",
    "visitor-phone": "",
    "visitor-year": "",
    "visitor-make": "",
    "visitor-model": "",
    "visitor-color": "",
    "visitor-license-plate-number": "",
    "visitor-state-of-issuance": "",
    "visitor-email": "email@address.com",
    "visitor-address": "n/a",
    "visitor-apt-number": "n/a",
    "visitor-city": "n/a",
    "visitor-zip": "n/a",
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
        postingVisitorsForPermit: true,
      };

    case POSTED_VISITORS_FOR_PERMIT: {
      return {
        ...state,
        postingVisitorsForPermit: false,
      };
    }

    case CLEAR_VISITORS_TO_SUBMIT: {
      return {
        ...state,
        visitorsToSubmit: [],
      };
    }

    case SHOW_TOASTS: {
      const { results } = action.payload;

      const toasts = results.map((result) => {
        const { visitor } = result;
        const firstName = visitor["visitor-first-name"];
        const lastName = visitor["visitor-last-name"];
        const name = `${firstName} ${lastName}`;
        const successTitle = `Successfully submit ${name}`;
        const failTitle = `Failed to submit ${name}`;
        return {
          id: uuid4(),
          title: result.succeeded ? successTitle : failTitle,
          description: result.response,
          status: result.succeeded ? "success" : "error",
        };
      });

      return {
        ...state,
        toasts,
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

    case REMOVE_TOAST: {
      const { id } = action.payload;
      const toasts = state.toasts.filter((toast) => toast.id !== id);
      return {
        ...state,
        toasts,
      };
    }

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
