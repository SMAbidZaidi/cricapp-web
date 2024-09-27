import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import useHandleModal from "./useHandleModal";

export const useAuth = () => {
  const { openModal } = useHandleModal({ modal: "session-expired" });
  const [isLogin, setIsLogin] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("auth");

      if (token) {
        const jwt = jwtDecode(JSON.parse(token || "")?.jwt);
        const currentDate = (Date.now() / 1000).toFixed();
        if (jwt.exp && parseInt(currentDate) > jwt.exp) {
          setIsSessionExpired(true);
          openModal();
        }
      }

      setIsLogin(!!token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);

  return { isLogin, isSessionExpired };
};
