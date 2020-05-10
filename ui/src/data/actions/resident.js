import { get, post } from "../../API";

export const REQUEST_RESIDENT = "REQUEST_RESIDENT";
export const requestResident = () => ({
  type: REQUEST_RESIDENT,
});

export const RECEIVE_RESIDENT = "RECEIVE_RESIDENT";
export const receiveResident = (fields) => ({
  type: RECEIVE_RESIDENT,
  payload: { fields },
});

export const SAVING_RESIDENT = "SAVING_RESIDENT";
export const savingResident = () => ({
  type: SAVING_RESIDENT,
});

export const SAVED_RESIDENT = "SAVED_RESIDENT";
export const savedResident = () => ({
  type: SAVED_RESIDENT,
});

export const saveResident = (resident, onComplete) => (dispatch) => {
  dispatch(savingResident());
  post(
    "/resident",
    resident,
    (resp) => {
      dispatch(savedResident());
      dispatch(fetchResident());
    },
    (e) => console.error("Could not save resident", e)
  ).then(onComplete);
};

export const fetchResident = () => (dispatch) => {
  dispatch(requestResident());
  get(
    "/resident",
    (response) => response.json(),
    (e) => console.error("Could not get resident", e)
  ).then((json) => {
    console.log("Got resident", json);
    dispatch(receiveResident(json));
  });
};
