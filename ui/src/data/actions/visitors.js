import { get, post, put, del } from "../../API";
import { setTabIndex } from "./app";
import { fetchHistory } from "./history";

export const TOGGLE_VISITOR_FOR_SUBMIT = "TOGGLE_VISITOR_FOR_SUBMIT";
export const toggleForSubmit = (id) => ({
  type: TOGGLE_VISITOR_FOR_SUBMIT,
  payload: { id },
});

export const SUBMIT_VISITORS = "SUBMIT_VISITORS";
export const submitVisitors = (visitors) => ({
  type: SUBMIT_VISITORS,
  payload: { visitors },
});

export const REQUEST_VISITORS = "REQUEST_VISITORS";
export const requestVisitors = () => ({
  type: REQUEST_VISITORS,
});

export const RECEIVE_VISITORS = "RECEIVE_VISITORS";
export const receiveVisitors = (json) => ({
  type: RECEIVE_VISITORS,
  payload: { json },
});

export const SAVING_VISITOR = "SAVING_VISITOR";
export const savingVisitor = () => ({
  type: SAVING_VISITOR,
});

export const SAVED_VISITOR = "SAVED_VISITOR";
export const savedVisitor = () => ({
  type: SAVED_VISITOR,
});

export const DELETING_VISITOR = "DELETING_VISITOR";
export const deletingVisitor = () => ({
  type: DELETING_VISITOR,
});

export const DELETED_VISITOR = "DELETED_VISITOR";
export const deletedVisitor = () => ({
  type: DELETED_VISITOR,
});

export const POSTING_VISITORS_FOR_PERMIT = "POSTING_VISITORS_FOR_PERMIT";
export const postingVisitorsForPermit = () => ({
  type: POSTING_VISITORS_FOR_PERMIT,
});

export const POSTED_VISITORS_FOR_PERMIT = "POSTED_VISITORS_FOR_PERMIT";
export const postedVisitorsForPermit = () => ({
  type: POSTED_VISITORS_FOR_PERMIT,
});

export const CLEAR_VISITORS_TO_SUBMIT = "CLEAR_VISITORS_TO_SUBMIT";
export const clearVisitorsToSubmit = () => ({
  type: CLEAR_VISITORS_TO_SUBMIT,
});

export const SHOW_TOASTS = "SHOW_TOASTS";
export const showToasts = (results) => ({
  type: SHOW_TOASTS,
  payload: { results },
});

export const MARK_INVALID_VISITORS = "MARK_INVALID_VISITORS";
export const markInvalidVisitors = (results) => ({
  type: MARK_INVALID_VISITORS,
  payload: { results },
});

export const CLEAR_SUBMISSION = "CLEAR_SUBMISSION";
export const clearSubmission = () => ({
  type: CLEAR_SUBMISSION,
});

export const SET_VISITOR_FORM_INITIAL_VALUES =
  "SET_VISITOR_FORM_INITIAL_VALUES";
export const setVisitorFormInitialValues = (values) => ({
  type: SET_VISITOR_FORM_INITIAL_VALUES,
  payload: { values },
});

export const REMOVE_TOAST = "REMOVE_TOAST";
export const removeToast = (id) => ({
  type: REMOVE_TOAST,
  payload: { id },
});

export const OPEN_DELETE_VISITOR_DIALOG = "OPEN_DELETE_VISITOR_DIALOG";
export const openDeleteVisitorDialog = (visitorId) => ({
  type: OPEN_DELETE_VISITOR_DIALOG,
  payload: { visitorId },
});

export const CLOSE_DELETE_VISITOR_DIALOG = "CLOSE_DELETE_VISITOR_DIALOG";
export const closeDeleteVisitorDialog = () => ({
  type: CLOSE_DELETE_VISITOR_DIALOG,
});

export const saveVisitor = (visitor, onComplete) => (dispatch) => {
  dispatch(savingVisitor());

  const onSuccess = (resp) => {
    dispatch(savedVisitor());
    dispatch(setTabIndex(0));
    dispatch(fetchVisitors());
  };

  const onError = (e) => console.error("Could not save visitor", e);

  if (visitor["_id"]) {
    put("/visitor/" + visitor["_id"], visitor, onSuccess, onError).then(
      onComplete
    );
  } else {
    post("/visitor", visitor, onSuccess, onError).then(onComplete);
  }
};

export const fetchVisitors = () => (dispatch) => {
  dispatch(requestVisitors());

  get(
    "/visitor",
    (response) => response.json(),
    (e) => {
      throw Error(`Could not get visitors ${e}`);
    }
  ).then((json) => {
    console.log("Got visitors", json);
    dispatch(receiveVisitors(json));
  });
};

export const deleteVisitor = (id) => (dispatch) => {
  dispatch(deletingVisitor());
  del(
    `/visitor/${id}`,
    (resp) => {
      dispatch(closeDeleteVisitorDialog());
      dispatch(fetchVisitors());
    },
    (e) => {
      throw Error(`Could not delete visitor ${e}`);
    }
  );
};

export const postVisitorsForPermit = (visitors) => (dispatch) => {
  dispatch(postingVisitorsForPermit());
  post(
    "/permit",
    visitors,
    (response) => response.json(),
    (e) => {
      throw Error(`Could not post visitors for permit: ${e}`);
    }
  ).then((results) => {
    dispatch(postedVisitorsForPermit());
    dispatch(clearVisitorsToSubmit());
    dispatch(showToasts(results));
    dispatch(markInvalidVisitors(results));
    dispatch(fetchHistory());
  });
};
