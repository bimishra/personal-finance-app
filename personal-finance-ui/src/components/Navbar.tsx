import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../services/auth";
import { clearUser } from "../state/slices/userSlice";
import { RootState } from "../state/store";
import { useUser } from "../context/UserContext";

export default function Navbar(): JSX.Element {
  const { user, isAuthenticated } = useUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Clear Redux state
      dispatch(clearUser());
      
      // Perform Auth0 logout
      await logout();
      
      // Note: logout() will redirect to Auth0 logout page, so we don't need to navigate here
    } catch (error) {
      console.error("Logout failed:", error);
      // If logout fails, at least navigate to login
      navigate("/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="mx-auto px-4 py-4 max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-2xl font-bold text-indigo-600">
            Finance
          </Link>
          {isAuthenticated && (
            <nav className="hidden md:flex gap-3 text-sm text-gray-600">
              <Link to="/accounts" className="hover:text-indigo-600">
                Accounts
              </Link>
              <Link to="/transactions" className="hover:text-indigo-600">
                Transactions
              </Link>
              <Link to="/budgets" className="hover:text-indigo-600">
                Budgets
              </Link>
              <Link to="/reports" className="hover:text-indigo-600">
                Reports
              </Link>
            </nav>
          )}
        </div>
        {isAuthenticated && (
          <div className="flex items-center gap-3">
            {user && (
              <span className="text-sm text-gray-700">
                {user.displayName ?? user.email}
              </span>
            )}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`px-3 py-1 border rounded text-sm transition-all duration-200 ${
                isLoggingOut 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                  : "hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              {isLoggingOut ? (
                <div className="flex items-center gap-1">
                  <div className="animate-spin rounded-full h-3 w-3 border-t border-b border-gray-400"></div>
                  Logging out...
                </div>
              ) : (
                "Logout"
              )}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
