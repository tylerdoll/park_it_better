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

export const REQUEST_RESIDENT = 'REQUEST_RESIDENT';
export const requestResident = () => ({
  type: REQUEST_RESIDENT,
});

export const RECEIVE_RESIDENT = 'RECEIVE_RESIDENT';
export const receiveResident = (resident) => ({
  type: RECEIVE_RESIDENT,
  payload: {resident},
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

export const SAVING_RESIDENT = 'SAVING_RESIDENT';
export const savingResident = () => ({
  type: SAVING_RESIDENT,
});

export const SAVED_RESIDENT = 'SAVED_RESIDENT';
export const savedResident = () => ({
  type: SAVED_RESIDENT,
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

export const SET_TAB_INDEX = "SET_TAB_INDEX";
export const setTabIndex = (tabIndex) => ({
    type: SET_TAB_INDEX,
    payload: {tabIndex},
});

export const saveResident = (resident, onComplete) => (dispatch) => {
  dispatch(savingResident());
  post('/resident',
      resident,
      (resp) => {
        dispatch(savedResident());
        dispatch(fetchResident());
      },
      (e) => console.error('Could not save resident', e),
  ).then(onComplete);
};

export const saveVisitor = (visitor, onComplete) => (dispatch) => {
  dispatch(savingVisitor());

  const onSuccess = (resp) => {
    dispatch(savedVisitor());
    dispatch(setTabIndex(0));
    dispatch(fetchVisitors());
  };

  const onError = (e) => console.error('Could not save visitor', e);

  if (visitor["_id"]) {
      put('/visitor/' + visitor["_id"],
          visitor,
          onSuccess,
          onError, 
      ).then(onComplete);
  }
  else {
      post('/visitor',
          visitor,
          onSuccess,
          onError, 
      ).then(onComplete);
  }
};

export const fetchResident = () => (dispatch) => {
  dispatch(requestResident());
  get('/resident',
      (response) => response.json(),
      (e) => console.error('Could not get resident', e),
  )
  .then((json) => {
      console.log('Got resident', json);
      dispatch(receiveResident(json)); 
   });
};

export const fetchVisitors = () => (dispatch) => {
  dispatch(requestVisitors());

  get('/visitor',
      (response) => response.json(),
      (e) => console.error('Could not get visitors', e),
  )
  .then((json) => {
      console.log("Got visitors", json);
      dispatch(receiveVisitors(json));
  });
};

export const postVisitorsForPermit = (visitors) => (dispatch) => {
  dispatch(postingVisitorsForPermit());
  post('/visitor/submit',
      visitors,
      (response) => response.json(),
      (e) => console.error('Could not post visitors for permit', e),
  )
  .then((results) => {
    dispatch(postedVisitorsForPermit(results));
  });
};
