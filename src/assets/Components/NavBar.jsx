import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { NavLink } from "react-router";
import { API } from "../../api";

const NavBar = ({ user, logout }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [showBooks, setShowBooks] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [MyBooks, setMyBooks] = useState([]);
  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await fetch(API.getCheckedOutBooks(), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setMyBooks(data);
      } catch (error) {
        console.error("Error fetching my books:", error);
      }
    };
    fetchMyBooks();
  }, [showBooks===true]);

  const namespace = "https://libdemo.example.com";
  const roles = user?.[`${namespace}/roles`] || [];

  const navLinkClass =
    "cursor-pointer rounded-lg bg-purple-600 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-purple-700 sm:py-2";

  return (
    <header className="relative flex flex-wrap items-center justify-between border-b border-gray-200 bg-blue-100 px-4 py-4 dark:border-gray-700 dark:bg-gray-800 sm:flex-nowrap sm:px-6">
      <div className="text-left">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white sm:text-2xl">
          Welcome To The Library
        </h1>
        <p className="hidden text-sm text-gray-500 dark:text-gray-400 sm:block">
          Logged in as{" "}
          <span className="capitalize">
            {user?.given_name || user?.nickname || user?.name}
          </span>
        </p>
      </div>

      {/* Hamburger toggle - mobile only */}
      <button
        type="button"
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((prev) => !prev)}
        className="cursor-pointer rounded-lg p-2 text-gray-700 transition hover:bg-blue-200 dark:text-gray-200 dark:hover:bg-gray-700 sm:hidden"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {menuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      <nav
        className={
          (menuOpen ? "flex" : "hidden") +
          " mt-4 w-full flex-col gap-3 border-t border-gray-200 bg-blue-100 pt-4 dark:border-gray-700 dark:bg-gray-800 sm:mt-0 sm:flex sm:w-auto sm:flex-row sm:items-center sm:border-0 sm:bg-transparent sm:pt-0 dark:sm:bg-transparent"
        }
      >
      <NavLink to="/" onClick={() => setMenuOpen(false)} className={navLinkClass}>
        Home
      </NavLink>
      <NavLink to="/About" onClick={() => setMenuOpen(false)} className={navLinkClass}>
        About
      </NavLink>
      <NavLink to="/CheckIn" onClick={() => setMenuOpen(false)} className={navLinkClass}>
        Check In Book
      </NavLink>
      {roles.includes("Admin") && (
        <NavLink to="/Admin" onClick={() => setMenuOpen(false)} className={navLinkClass}>
          Admin
        </NavLink>
      )}

      <div className="relative">
      <button
        className={navLinkClass + " w-full sm:w-auto"}
        onClick={() => setShowBooks(!showBooks)}
      >
        {showBooks ? "Hide My Books" : "Show My Books"}
      </button>
      {showBooks && (
        <div className="absolute right-0 top-full mt-2 w-[min(20rem,calc(100vw-2rem))] bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-50">
          <div className="border-b border-gray-100 pb-2 mb-3">
            <h2 className="text-lg font-semibold text-gray-800">
              Books Checked Out: ({MyBooks.length})
            </h2>
          </div>
          {MyBooks.length === 0 ? (
            <p>You do not have any books checked out</p>
          ) : (
            <>
              {" "}
              <ul className="max-h-60 overflow-y-auto divide-y divide-gray-100 pr-1">
                {MyBooks.map((item) => (
                  <li
                    key={item.id}
                    className="py-2 flex justify-between items-center gap-4"
                  >
                    <div>
                      {" "}
                      <p className="font-medium text-gray-800 text-sm truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.firstName} {item.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Due: {new Date(item.dueDate).toLocaleDateString()}
                      </p>
                      {item.isOverdue && (
                        <p className="text-xs text-red-500">
                          Overdue please return the book
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
      </div>

      <button
        onClick={() => {
          setMenuOpen(false);
          logout();
        }}
        className="cursor-pointer py-1 text-left text-sm font-medium text-gray-800 underline transition hover:text-gray-600 dark:text-gray-200 sm:ml-2 sm:border-l sm:border-gray-300 sm:pl-4"
      >
        Logout
      </button>
      </nav>
    </header>
  );
};

export default NavBar;
