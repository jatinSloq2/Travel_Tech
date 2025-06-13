import { createContext, useContext, useEffect, useReducer } from "react";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext();

const initialState = {
  isLoggedIn: false,
  role: "",
  user: null,
  error: "",
  success: "",
  loading: true,
  showLoginModal: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        success: "Login Successfully",
        error: "",
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        error: "Invalid email or password",
        success: "",
      };
    case "REGISTER_SUCCESS":
      return {
        ...state,
        success: "Registration Success",
        error: "",
      };
    case "REGISTER_FAILURE":
      return {
        ...state,
        error: "Signup failed. Try again.",
        success: "",
      };
    case "SET_USER":
      return {
        ...state,
        isLoggedIn: true,
        role: action.payload.role,
        user: action.payload.user,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...initialState,
        loading: false,
      };
    case "CHECK_USER_FAILED":
      return {
        ...state,
        isLoggedIn: false,
        role: "",
        user: null,
        loading: false,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "SET_SUCCESS":
      return {
        ...state,
        success: action.payload,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: "",
      };

    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.success || state.error) {
      const timer = setTimeout(() => {
        dispatch({ type: "CLEAR_ERROR" });
        dispatch({ type: "SET_SUCCESS", payload: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.success, state.error]);

  const checkUser = async () => {
    try {
      const res = await axiosInstance.get("/user/me");
      if (res.data && res.data.user) {
        dispatch({
          type: "SET_USER",
          payload: {
            user: res.data.user,
            role: res.data.user.role,
          },
        });
      } else {
        dispatch({ type: "CHECK_USER_FAILED" });
      }
    } catch (err) {
      console.error(err);
      dispatch({ type: "CHECK_USER_FAILED" });
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const loginUser = async (formData) => {
    try {
      const res = await axiosInstance.post("/user/login", formData);
      if (res.data && res.data.message === "Login success") {
        dispatch({ type: "LOGIN_SUCCESS" });
        checkUser();
      }
    } catch (err) {
      console.error(err);
      dispatch({ type: "LOGIN_FAILURE" });
      return false;
    }
  };

  const signupUser = async (formData) => {
    try {
      await axiosInstance.post("/user/register", formData);
      dispatch({ type: "REGISTER_SUCCESS" });
      return true;
    } catch (err) {
      console.error(err);
      dispatch({ type: "REGISTER_FAILURE" });
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/user/logout");
    } catch (err) {
      console.error("Logout failed", err);
    }
    dispatch({ type: "LOGOUT" });
  };

  const authValues = {
    isLoggedIn: state.isLoggedIn,
    role: state.role,
    user: state.user,
    loginUser,
    signupUser,
    handleLogout,
    error: state.error,
    loading: state.loading,
    success: state.success,
    setSuccess: (msg) => dispatch({ type: "SET_SUCCESS", payload: msg }),
    setError: (msg) => dispatch({ type: "SET_ERROR", payload: msg }),
  };

  return (
    <AuthContext.Provider value={authValues}>{children}</AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
