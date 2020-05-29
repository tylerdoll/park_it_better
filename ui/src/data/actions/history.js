import { get } from "../../API";

export const REQUEST_HISTORY = "REQUEST_HISTORY";
export const requestHistory = () => ({
  type: REQUEST_HISTORY,
});

export const RECEIVE_HISTORY = "RECEIVE_HISTORY";
export const receiveHistory = (permitHistory) => ({
  type: RECEIVE_HISTORY,
  payload: { permitHistory },
});

export const fetchHistory = () => (dispatch) => {
  get(
    "/permit/history",
    (response) => response.json(),
    (e) => {
      throw Error(`Could not get history ${e}`);
    }
  ).then((json) => {
    console.log("Got history", json);
    dispatch(receiveHistory(json));
  });
};
