import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import Login from "../Pages/Authentication/Login";
import Registration from "../Pages/Authentication/Register";
import Home from "../Pages/HomePage";
import JobDetails from "../Pages/JobDetails";
import AddJob from "../Pages/AddJob";
import MyPostedJobs from "../Pages/MyPostedJobs";
import MyBids from "../Pages/MyBids";
import UpdateJob from "../Pages/UpdateJob";
import PrivateRoute from "./PrivateRoute";
import BidRequests from "../Pages/BidRequests";

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
        element: (
          <PrivateRoute>
            <JobDetails />
          </PrivateRoute>
        ),
        loader: ({ params }) =>
          fetch(`${import.meta.env.VITE_APP_URL}/job/${params.id}`),
      },

      {
        path: "/add-job",
        element: (
          <PrivateRoute>
            <AddJob />
          </PrivateRoute>
        ),
      },

      {
        path: "/my-posted-jobs",
        element: (
          <PrivateRoute>
            <MyPostedJobs />
          </PrivateRoute>
        ),
      },

      {
        path: "/update-job/:id",
        element: (
          <PrivateRoute>
            <UpdateJob />
          </PrivateRoute>
        ),
        loader: ({ params }) =>
          fetch(`${import.meta.env.VITE_APP_URL}/job/${params.id}`),
      },

      {
        path: "/my-bids",
        element: (
          <PrivateRoute>
            <MyBids />
          </PrivateRoute>
        ),
      },

      {
        path: "/bid-request",
        element: (
          <PrivateRoute>
            <BidRequests />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
