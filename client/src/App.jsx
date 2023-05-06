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
import DodajDokument from "./pages/dokumenty/DodajDokument";
import Prace from "./pages/prace/Prace";
import DodajPrace from "./pages/prace/DodajPrace";
import PracaInfo from "./pages/prace/PracaInfo";
import UsunPracownika from "./pages/pracownicy/UsunPracownika";
import UpdatePracownika from "./pages/pracownicy/UpdatePracownika";
import Kontrakty from "./pages/pracownicy/Kontrakty";
import DodajKontrakt from "./pages/pracownicy/DodajKontrakt";
import Opiekunowie from "./pages/pracownicy/Opiekunowie";
import PrzypiszOpiekuna from "./pages/pracownicy/PrzypiszOpiekuna";
import Kalendarz from "./pages/calendar/Kalendarz";
import DodajEvent from "./pages/calendar/DodajEvent";
import PracownicyInfo from "./pages/pracownicy/PracownicyInfo";
import Rozliczenia from "./pages/rozliczenia/Rozliczenia";

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

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(currentUser.user_role)) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute allowedRoles={["adm", "per", "acc", "sv", "emp"]}>
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
          element: (
            <ProtectedRoute allowedRoles={["per", "acc"]}>
              <Outlet />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "/pracownicy",
              element: <Pracownicy />,
            },
            {
              path: "/pracownicy/:id/info",
              element: <PracownicyInfo />,
            },
            {
              path: "/pracownicy/:id/rozliczenie",
              element: <Rozliczenia />,
            },
            {
              path: "/pracownicy/:id/dokumenty",
              element: <Dokumenty />,
            },
            {
              path: "/pracownicy/:id/dokumenty/dodaj",
              element: <DodajDokument />,
            },
            {
              path: "/pracownicy/dodaj",
              element: <DodajPracownika />,
            },
            {
              path: "/pracownicy/usun",
              element: <UsunPracownika />,
            },
            {
              path: "/pracownicy/update",
              element: <UpdatePracownika />,
            },
            {
              path: "/pracownicy/contracts",
              element: <Kontrakty />,
            },
            {
              path: "/pracownicy/contracts/addcontract",
              element: <DodajKontrakt />,
            },
            {
              path: "/pracownicy/supervisor",
              element: <Opiekunowie />,
            },
            {
              path: "/pracownicy/supervisor/assignsv",
              element: <PrzypiszOpiekuna />,
            },
          ],
        },
        {
          path: "/prace",
          element: (
            <ProtectedRoute allowedRoles={["per", "acc"]}>
              <Outlet />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "/prace",
              element: <Prace />,
            },
            {
              path: "/prace/dodaj",
              element: <DodajPrace />,
            },
            {
              path: "/prace/:id/info",
              element: <PracaInfo />,
            },
          ],
        },
        {
          path: "/kalendarz",
          element: (
            <ProtectedRoute allowedRoles={["per", "acc"]}>
              <Outlet />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "/kalendarz",
              element: <Kalendarz />,
            },
            {
              path: "/kalendarz/dodaj",
              element: <DodajEvent />,
            },
          ],
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
