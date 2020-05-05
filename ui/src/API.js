const BASE_PATH = `http://${window.location.hostname}:5000`;

export function get(route, onSuccess, onError) {
  return fetch(BASE_PATH + route)
    .then(
      (response) => onSuccess(response),
      (error) => onError(error),
    )
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
    (response) => onSuccess(response),
    (error) => onError(error),
  )
}

export function put(route, json, onSuccess, onError) {
  return fetch(BASE_PATH + route, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(json),
  })
  .then(
    (response) => onSuccess(response),
    (error) => onError(error),
  )
}

export function del(route, onSuccess, onError) {
  return fetch(BASE_PATH + route, {
    method: 'DELETE',
  })
  .then(
    (response) => onSuccess(response),
    (error) => onError(error),
  )
}
