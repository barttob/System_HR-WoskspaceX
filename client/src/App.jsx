import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

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
import UpdatePracownika from "./pages/pracownicy/UpdatePracownika";
import Kontrakty from "./pages/pracownicy/Kontrakty";
import DodajKontrakt from "./pages/pracownicy/DodajKontrakt";
import Opiekunowie from "./pages/pracownicy/Opiekunowie";
import PrzypiszOpiekuna from "./pages/pracownicy/PrzypiszOpiekuna";
import Kalendarz from "./pages/calendar/Kalendarz";
import DodajEvent from "./pages/calendar/DodajEvent";
import Harmonogram from "./pages/harmonogram/Harmonogram";
import PracownicyInfo from "./pages/pracownicy/PracownicyInfo";
import Rozliczenia from "./pages/rozliczenia/Rozliczenia";
import Urlop from "./pages/harmonogram/Urlop";
import Zwolnienie from "./pages/harmonogram/Zwolnienie";
import EmpDokumenty from "./pages/pracownik/EmpDokumenty";
import Profil from "./pages/pracownik/Profil";
import DoZatwierdzenia from "./pages/dokumenty/DoZatwierdzenia";
import Wnioski from "./pages/wnioski/Wnioski";
import Podopieczni from "./pages/podopieczni/Podopieczni";
import Wynagrodzenie from "./pages/pracownik/Wynagrodzenie";
import PracaHarmonogram from "./pages/prace/PracaHarmonogram";

function App() {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [auth, setAuth] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3001/auth/current-session").then(({ data }) => {
      console.log(data.sessionExpired);
      setAuth(data);
      if (data.sessionExpired) {
        localStorage.clear();
        return <Navigate to="/login" />;
      }
    });
  }, []);

  useEffect(() => {}, []);

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

  // const ProtectedRoute = ({ children, allowedRoles }) => {
  //   if (auth === null) {
  //     return <Navigate to="/login" />;
  //   }

  //   // if (!allowedRoles.includes(currentUser.user_role)) {
  //   //   return <Navigate to="/login" />;
  //   // }
  //   if (auth) {
  //     return children;
  //   }
  // };
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
          path: "/dozatwierdzenia",
          element: (
            <ProtectedRoute allowedRoles={["per", "acc"]}>
              <Outlet />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "/dozatwierdzenia",
              element: <DoZatwierdzenia />,
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
            {
              path: "/prace/:id/harmonogram",
              element: <PracaHarmonogram />,
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
        {
          path: "/harmonogram",
          element: (
            <ProtectedRoute allowedRoles={["emp"]}>
              <Outlet />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "/harmonogram",
              element: <Harmonogram />,
            },
            {
              path: "/harmonogram/urlop",
              element: <Urlop />,
            },
            {
              path: "/harmonogram/zwolnienie",
              element: <Zwolnienie />,
            },
          ],
        },
        {
          path: "/dokumenty",
          element: (
            <ProtectedRoute allowedRoles={["emp"]}>
              <Outlet />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "/dokumenty",
              element: <EmpDokumenty />,
            },
            {
              path: "/dokumenty/dodaj",
              element: <DodajDokument />,
            },
          ],
        },
        {
          path: "/profil",
          element: (
            <ProtectedRoute allowedRoles={["emp"]}>
              <Outlet />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "/profil",
              element: <Profil />,
            },
          ],
        },
        {
          path: "/wynagrodzenie",
          element: (
            <ProtectedRoute allowedRoles={["emp"]}>
              <Outlet />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "/wynagrodzenie",
              element: <Wynagrodzenie />,
            },
          ],
        },
        {
          path: "/wnioski",
          element: (
            <ProtectedRoute allowedRoles={["per", "acc"]}>
              <Outlet />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "/wnioski",
              element: <Wnioski />,
            },
          ],
        },
        {
          path: "/podopieczni",
          element: (
            <ProtectedRoute allowedRoles={["sv"]}>
              <Outlet />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "/podopieczni",
              element: <Podopieczni />,
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
