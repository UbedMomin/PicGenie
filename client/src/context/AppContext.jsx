import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// Add this import at the top
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [credit, setCredit] = useState(0); // Initialize with 0 instead of false

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  const loadCreditData = async () => {
    try {
      // Don't proceed if no token exists
      if (!token) {
        setUser(null);
        setCredit(0);
        return;
      }

      const { data } = await axios.get(`${backendUrl}/api/user/credits`, {
        headers: {
          Authorization: `Bearer ${token}`, // Standard auth header format
        },
      });

      if (data.success) {
        setCredit(data.credits || 0);
        setUser(data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // Token is invalid/expired - clear it
        logout();
        toast.error("Session expired. Please login again.");
      } else {
        console.error("Credit load error:", error);
        toast.error(error.response?.data?.message || "Failed to load credits");
      }
    }
  };

 const generateImage = async (prompt) => {
  try {
    // 1. Validate token exists
    if (!token) {
      toast.error("Please login to generate images");
      setShowLogin(true);
      return null;
    }

    // 2. Make the request with proper auth header
    const { data } = await axios.post(
      `${backendUrl}/api/image/generate-image`,
      { prompt },
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 30000 // 30-second timeout
      }
    );

    // 3. Handle successful response
    if (data.success) {
      await loadCreditData(); // Refresh user credits
      return data.resultImage;
    }

    // 4. Handle insufficient credits
    if (data.creditBalance === 0) {
      navigate("/buy-credits");
      toast.error("Insufficient credits");
    } else {
      toast.error(data.message || "Generation failed");
    }
    return null;

  } catch (error) {
    // 5. Handle 401 specifically
    if (error.response?.status === 401) {
      logout();
      toast.error("Session expired. Please login again");
      setShowLogin(true);
    } 
    // 6. Handle other errors
    else if (error.code === "ECONNABORTED") {
      toast.error("Request timed out. Please try again");
    } else {
      toast.error(error.response?.data?.message || "Image generation failed");
    }
    return null;
  }
};

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setCredit(0);
    toast.success("Logged out successfully");
  };

  useEffect(() => {
    loadCreditData();
  }, [token]);

  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    backendUrl,
    token,
    setToken,
    credit,
    setCredit,
    loadCreditData,
    logout,
    generateImage, 

  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
