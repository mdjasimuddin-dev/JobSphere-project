import axios from "axios";

export const axiosPublic = axios.create({
  baseURL: `${import.meta.env.VITE_APP_URL}`,
  withCredentials: true,
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
