const BASE_PATH = `http://${window.location.hostname}:5000`;

/**
 * Send HTTP GET request
 *
 * @param {string} route Route to send request to
 * @param {function} onSuccess Function to call when request is succesful
 * @param {function} onError Function to call when request fails
 * @return {promise} Response from API
 */
export function get(route, onSuccess, onError) {
  return fetch(BASE_PATH + route).then(
    (response) => onSuccess(response),
    (error) => onError(error)
  );
}

/**
 * Send HTTP POST request
 *
 * @param {string} route Route to send request to
 * @param {object} json JSON to send in request body
 * @param {function} onSuccess Function to call when request is succesful
 * @param {function} onError Function to call when request fails
 * @return {promise} Response from API
 */
export function post(route, json, onSuccess, onError) {
  return fetch(BASE_PATH + route, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(json),
  }).then(
    (response) => onSuccess(response),
    (error) => onError(error)
  );
}

/**
 * Send HTTP PUT request
 *
 * @param {string} route Route to send request to
 * @param {object} json JSON to send in request body
 * @param {function} onSuccess Function to call when request is succesful
 * @param {function} onError Function to call when request fails
 * @return {promise} Response from API
 */
export function put(route, json, onSuccess, onError) {
  return fetch(BASE_PATH + route, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(json),
  }).then(
    (response) => onSuccess(response),
    (error) => onError(error)
  );
}

/**
 * Send HTTP DELETE request
 *
 * @param {string} route Route to send request to
 * @param {function} onSuccess Function to call when request is succesful
 * @param {function} onError Function to call when request fails
 * @return {promise} Response from API
 */
export function del(route, onSuccess, onError) {
  return fetch(BASE_PATH + route, {
    method: "DELETE",
  }).then(
    (response) => onSuccess(response),
    (error) => onError(error)
  );
}
