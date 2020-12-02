import { authRequest } from "./auth";

const getDecks = (page = 1, search="") => {
  const extraParameters = { params: { page, search} };

  return authRequest
    .get(`/decks/`, extraParameters)
    .then((response => Promise.resolve(response.data)))
    .catch(error => Promise.reject(error));
}

const getDeck = (id: string) => {
  return authRequest
    .get(`/decks/${id}`)
    .then((response => Promise.resolve(response.data)))
    .catch(error => Promise.reject(error));
}

const createDeck = (data: any) => {
  return authRequest
    .post(`/decks/create/`, data)
    .then((response => Promise.resolve(response.data)))
    .catch(error => Promise.reject(error));
}

// Will create played deck record and return hash
const createPlayDeck = (id: string) => {
  return authRequest
    .post(`/decks/${id}/play/`)
    .then((response => Promise.resolve(response.data)))
    .catch(error => Promise.reject(error));
}

//
const getPlayDeck = (id: string) => {
  return authRequest
    .get(`/play/${id}/`)
    .then((response => Promise.resolve(response.data)))
    .catch(error => Promise.reject(error));
}

const getPlayDecks = (page = 1, search="") => {
  const extraParameters = { params: { page, search} };

  return authRequest
    .get(`/plays/`, extraParameters)
    .then((response => Promise.resolve(response.data)))
    .catch(error => Promise.reject(error));
}

const playDeck = (id: string, cards: string[]) => {
  return authRequest
    .post(`/play/${id}/`, cards)
    .then((response => Promise.resolve(response.data)))
    .catch(error => Promise.reject(error));
}

export { getDecks, getDeck, createDeck, createPlayDeck, playDeck, getPlayDeck, getPlayDecks };
