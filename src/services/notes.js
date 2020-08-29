import axios from "axios";
const baseUrl = "http://localhost:3001/api/notes";

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  //   const nonExisting = {
  //     id: 10000,
  //     content: "This note is not saved to server",
  //     date: "2019-05-30T17:30:31.098Z",
  //     important: true,
  //   };
  //   return request.then((response) => response.data.concat(nonExisting));
  return request.then((response) => response.data);
};

const getOne = (id) => {
  const request = axios.get(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

const createOne = (newObject) => {
  const config = {
    headers: { authorization: token },
  };

  const request = axios.post(baseUrl, newObject, config);
  return request.then((response) => response.data);
};

const updateOne = (id, newObject) => {
  const config = {
    headers: { authorization: token },
  };

  const request = axios.put(`${baseUrl}/${id}`, newObject, config);
  return request.then((response) => response.data);
};

export default {
  getAll: getAll,
  getOne: getOne,
  createOne: createOne,
  updateOne: updateOne,
  setToken: setToken,
};
