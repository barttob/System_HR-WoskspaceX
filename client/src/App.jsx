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
import Pracownicy from "./pages/pracownicy/Pracownicy";
import Dokumenty from "./pages/dokumenty/Dokumenty";
import DodajPracownika from "./pages/pracownicy/DodajPracownika";

function App() {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const Layout = () => {
    return (
      <>
        <Navbar />
        <div className="content">
          <Outlet />
        </div>
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
        {
          path: "/pracownicy",
          element: <Pracownicy />,
        },
        {
          path: "/pracownicy/:id/dokumenty",
          element: <Dokumenty />,
        },
        {
          path: "/pracownicy/dodaj",
          element: <DodajPracownika />,
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
