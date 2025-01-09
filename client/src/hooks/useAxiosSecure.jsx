import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import { useNavigate } from "react-router-dom";
const axiosSecure = axios.create({
  baseURL: `${import.meta.env.VITE_APP_URL}`,
  withCredentials: true,
});

const useAxiosSecure = () => {
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  // interceptor

  //   Response Interceptor
  axiosSecure.interceptors.response.use(
    (res) => {
      console.log("response asar agei ami check diyechi");
      return res;
    },
    async (error) => {
      console.log("Error from axios interceptor", error.response);
      if (error.response.status === 401 || error.response.status === 403) {
        await logOut();
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
