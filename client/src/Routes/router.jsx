import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import Login from "../Pages/Authentication/Login";
import Registration from "../Pages/Authentication/Register";
import Home from "../Pages/HomePage";
import JobDetails from "../Pages/JobDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />,

    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/registration",
        element: <Registration />,
      },
      {
        path: "/job/:id",
        element: <JobDetails />,
        loader : ({params})=> fetch(`${import.meta.env.VITE_APP_URL}/job/${params.id}`)
      },
    ],
  },
]);

export default router;
