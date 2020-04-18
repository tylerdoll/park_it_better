import {get, post, put} from '../API';

export const TOGGLE_VISITOR_FOR_SUBMIT = 'TOGGLE_VISITOR_FOR_SUBMIT';
export const toggleForSubmit = (id) => ({
  type: TOGGLE_VISITOR_FOR_SUBMIT,
  payload: {id},
});

export const SUBMIT_VISITORS = 'SUBMIT_VISITORS';
export const submitVisitors = (visitors) => ({
  type: SUBMIT_VISITORS,
  payload: {visitors},
});

export const REQUEST_VISITORS = 'REQUEST_VISITORS';
export const requestVisitors = () => ({
  type: REQUEST_VISITORS,
});

export const RECEIVE_VISITORS = 'RECEIVE_VISITORS';
export const receiveVisitors = (json) => ({
  type: RECEIVE_VISITORS,
  payload: {json},
});

export const SAVING_VISITOR = 'SAVING_VISITOR';
export const savingVisitor = () => ({
  type: SAVING_VISITOR,
});

export const SAVED_VISITOR = 'SAVED_VISITOR';
export const savedVisitor = () => ({
  type: SAVED_VISITOR,
});

export const POSTING_VISITORS_FOR_PERMIT = 'POSTING_VISITORS_FOR_PERMIT';
export const postingVisitorsForPermit = () => ({
  type: POSTING_VISITORS_FOR_PERMIT,
});

export const POSTED_VISITORS_FOR_PERMIT = 'POSTED_VISITORS_FOR_PERMIT';
export const postedVisitorsForPermit = (results) => ({
  type: POSTED_VISITORS_FOR_PERMIT,
  payload: {results},
});

export const CLEAR_SUBMISSION = 'CLEAR_SUBMISSION';
export const clearSubmission = () => ({
  type: CLEAR_SUBMISSION,
});

export const SET_VISITOR_FORM_INITIAL_VALUES = 'SET_VISITOR_FORM_INITIAL_VALUES';
export const setVisitorFormInitialValues = (values) => ({
  type: SET_VISITOR_FORM_INITIAL_VALUES,
  payload: {values},
});

export const saveVisitor = (visitor, onComplete) => (dispatch) => {
  dispatch(savingVisitor());
  if (visitor["_id"]) {
      put('/visitors/' + visitor["_id"],
          visitor,
          (resp) => {
            dispatch(savedVisitor());
            dispatch(fetchVisitors());
          },
          (e) => console.error('Could not save visitor', e),
      ).then(onComplete);
  }
  else {
      post('/visitors',
          visitor,
          (resp) => {
            dispatch(savedVisitor());
            dispatch(fetchVisitors());
          },
          (e) => console.error('Could not save visitor', e),
      ).then(onComplete);
  }
};

export const fetchVisitors = () => (dispatch) => {
  dispatch(requestVisitors());
  get('/visitors',
      (json) => {
        dispatch(receiveVisitors(json)); console.log('Got visitors', json);
      },
      (e) => console.error('Could not get visitors', e),
  );
};

export const postVisitorsForPermit = (visitors) => (dispatch) => {
  dispatch(postingVisitorsForPermit());
  post('/submit_visitors',
      visitors,
      (results) => {
        dispatch(postedVisitorsForPermit(results));
      },
      (e) => console.error('Could not post visitors for permit', e),
  );
};
