const BASE_PATH = `http://${window.location.hostname}:5000`;

export function get(route, onSuccess, onError) {
  return fetch(BASE_PATH + route)
      .then(
          (response) => response.json(),
          (error) => onError(error),
      )
      .then((json) => onSuccess(json));
}

export function post(route, json, onSuccess, onError) {
  return fetch(BASE_PATH + route, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(json),
  })
      .then(
          (response) => response.json(),
          (error) => onError(error),
      )
      .then((json) => onSuccess(json));
}
