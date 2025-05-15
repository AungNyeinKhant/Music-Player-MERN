import axios from "axios";

export const userAPI = axios.create({
  baseURL: "http://localhost:3000/api/user",
  headers: {
    "Content-Type": "application/json",
  },
});

export const artistAPI = axios.create({
  baseURL: "http://localhost:3000/api/artist",
  headers: {
    "Content-Type": "application/json",
  },
});

export const adminAPI = axios.create({
  baseURL: "http://localhost:3000/api/admin",
  headers: {
    "Content-Type": "application/json",
  },
});
