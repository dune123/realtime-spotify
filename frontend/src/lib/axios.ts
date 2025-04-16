import axios from "axios";

/*export const axiosInstance = axios.create({
	baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
});*/


export const axiosInstance = axios.create({
	baseURL:"realtime-spotify-production.up.railway.app/api", // replace with actual URL
  });
  