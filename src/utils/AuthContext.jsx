import { useState } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { useContext } from "react";
import { Loading } from "../components";
import { account } from "../appwrite/config";
import { useNavigate } from "react-router";
import { ID } from "appwrite";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getUserLoggedIn();
  }, []);
  const navigate = useNavigate();
  // user loggedin function
  const getUserLoggedIn = async () => {
    try {
      const accountDetails = await account.get();
      setUser(accountDetails);
    } catch (error) {
      console.error("error : ", error);
    }
    setLoading(false);
  };

  // user login function
  const handleUserLogin = async (e, credentials) => {
    e.preventDefault();
    try {
      const session = await account.createEmailPasswordSession(
        credentials.email,
        credentials.password
      );
      const accountDetails = await account.get();
      setUser(accountDetails);
      console.log(accountDetails);
      console.log(session);
      navigate("/");
    } catch (error) {
      console.log("error login", error.message);
    }
  };
  // user logout function
  const handleUserLogout = async () => {
    try {
      const result = await account.deleteSession("current");
      // console.log("logout user: ", result);
      setUser(null);
    } catch (error) {
      console.log("error logout", error.message);
    }
  };

  // create user function
  
  const handleUserRegister = async (credentials) => {
    try {
      const user = await account.create(
        ID.unique(),
        credentials.email,
        credentials.password,
        credentials.username,
      );
      await account.createEmailPasswordSession(
        credentials.email,
        credentials.password
      );
      const accountDetails = await account.get();
      setUser(accountDetails);
      navigate("/")
      console.log("user created successfully: ", user);

      // Set username in user preferences

      // await account.updatePrefs({ username: credentials.username });
      // console.log("Username set successfully");
    } catch (error) {
      console.error("error in signup", error.message);
    }
  };
  const contextData = {
    user,
    handleUserLogin,
    handleUserLogout,
    handleUserRegister,
  };
  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  );
};
export default AuthContext;

export const useAuth = () => {
  return useContext(AuthContext);
};
