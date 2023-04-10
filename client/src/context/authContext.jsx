import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(
      JSON.parse(localStorage.getItem("user")) || null
    );
    
    const login = async (inputs) => {
      const res = await axios.post("http://localhost:3001/login", {
        login: inputs.username,
        password: inputs.password,
      });

      console.log(res.data.user)
      setCurrentUser(res.data.user);
    };

    useEffect(() => {
      localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};

// const sendLoginData = async () => {
//     try {
//       const response = await axios.post("http://localhost:3001/login", {
//         login: username,
//         password: password,
//       });

//       if (response.data.success) {
//         setShowSuccessMessage(true);
//         setCurrentUser(response.data.user);
//         setTimeout(() => {
//           navigate("/");
//         }, 2000);
//       } else {
//         setErrorMessage("Niepoprawny login lub hasło. Spróbuj ponownie.");
//       }
//     } catch (error) {
//       setErrorMessage("Niepoprawny login lub hasło. Spróbuj ponownie.");
//       console.log(error);
//     }
//   };
