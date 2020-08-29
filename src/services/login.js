import axios from "axios";
const baseUrl = "http://localhost:3001/api/login";

const login = (credentials) => {
  const request = axios.post(baseUrl, credentials);
  return request.then((response) => response.data);
};

const logout = () => {
  window.localStorage.removeItem("loggedUser");
};

export default { login, logout };
