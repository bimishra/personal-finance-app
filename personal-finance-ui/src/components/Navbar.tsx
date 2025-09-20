import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { logout } from "../services/auth";
import { RootState } from "../state/store";

export default function Navbar(): JSX.Element {
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <header className="bg-white shadow">
      <div className="mx-auto px-4 py-4 max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            Finance
          </Link>
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
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <span className="text-sm text-gray-700">
              {user.displayName ?? user.email}
            </span>
          )}
          <button
            onClick={() => {
              logout().catch(console.error);
            }}
            className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
