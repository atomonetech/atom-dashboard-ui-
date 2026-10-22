import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const UserContext = createContext();


const readUserFromStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const token =
    localStorage.getItem("access_token");

  if (!token) {
    return null;
  }

  let groups = [];

  try {
    const storedGroups = JSON.parse(
      localStorage.getItem("user_groups") || "[]"
    );

    groups = Array.isArray(storedGroups)
      ? storedGroups
      : [];
  } catch (error) {
    console.error(
      "Invalid user_groups in localStorage:",
      error
    );

    groups = [];
  }

  const username =
    localStorage.getItem("username") || "";

  return {
    fullName:
      localStorage.getItem("full_name") ||
      username,

    email: username,

    profileImage:
      localStorage.getItem("profile_image") ||
      "",

    role:
      localStorage.getItem("user_role") ||
      "User",

    // IMPORTANT
    groups: groups,
  };
};


export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(
    readUserFromStorage
  );


  useEffect(() => {
    const syncUser = () => {
      setUser(readUserFromStorage());
    };


    // Login / Logout / permission refresh
    window.addEventListener(
      "userLoginUpdate",
      syncUser
    );


    // Multiple tabs support
    window.addEventListener(
      "storage",
      syncUser
    );


    return () => {
      window.removeEventListener(
        "userLoginUpdate",
        syncUser
      );

      window.removeEventListener(
        "storage",
        syncUser
      );
    };
  }, []);


  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () =>
  useContext(UserContext);