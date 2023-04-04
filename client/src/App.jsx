import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import "./App.css";

import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Navbar from "./components/navbar/Navbar";
import Pracownik from "./pages/pracownik/Pracownik";

function App() {
  const currentUser = true;

  const Layout = () => {
    return (
      <>
        <Navbar />
        <Outlet />
      </>
    );
  };

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Navigate to="/home" />,
        },
        {
          path: "/home",
          element: <Home />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
