import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { initAuth, handleRedirectCallback } from "../services/auth";
import { fetchUser } from "../state/slices/userSlice";
import type { AppDispatch } from "../state/store";

export default function LoginCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    (async () => {
      try {
        await initAuth();
        await handleRedirectCallback();

        // call /me via Redux thunk (axios client adds token automatically)
        await dispatch(fetchUser());

        navigate("/", { replace: true });
      } catch (e) {
        console.error("Callback error", e);
        navigate("/login");
      }
    })();
  }, [navigate, dispatch]);

  return <div className="p-8">Signing you in...</div>;
}
