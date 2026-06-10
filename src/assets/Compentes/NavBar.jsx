import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { NavLink } from "react-router";

const NavBar = ({ user, logout }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [showBooks, setShowBooks] = useState(false);
  const [MyBooks, setMyBooks] = useState([]);
  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await fetch("https://localhost:7025/getcheckedoutbooks", {
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
  }, [showBooks]);

  const namespace = "https://libdemo.example.com";
  const roles = user?.[`${namespace}/roles`] || [];

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-blue-100 px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="text-left">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome To The Library
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Logged in as{" "}
          <span className="capitalize">
            {user?.given_name || user?.nickname || user?.name}
          </span>
        </p>
      </div>
      <nav className="flex items-center gap-3">
      <NavLink
        to="/"
        className="cursor-pointer rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700"
      >
        Home
      </NavLink>
      <NavLink
        to="/About"
        className="cursor-pointer rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700"
      >
        About
      </NavLink>
      <NavLink
        to="/CheckIn"
        className="cursor-pointer rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700"
      >
        Check In Book
      </NavLink>
      {roles.includes("Admin") && (
        <NavLink
          to="/Admin"
          className="cursor-pointer rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700"
        >
          Admin
        </NavLink>
      )}

      <div className="relative">
      <button
        className="cursor-pointer rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700"
        onClick={() => setShowBooks(!showBooks)}
      >
        {showBooks ? "Hide My Books" : "Show My Books"}
      </button>
      {showBooks && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-50">
          <div className="border-b border-gray-100 pb-2 mb-3">
            <h2 className="text-lg font-semibold text-gray-800">
              Books Checked Out: ({MyBooks.length})
            </h2>
          </div>
          {MyBooks.length === 0 ? (
            <p>you do not have any books checked out</p>
          ) : (
            <>
              {" "}
              <ul className="ax-h-60 overflow-y-auto divide-y divide-gray-100 pr-1">
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
        onClick={logout}
        className="cursor-pointer ml-2 border-l border-gray-300 pl-4 text-sm font-medium text-gray-800 underline transition hover:text-gray-600"
      >
        Logout
      </button>
      </nav>
    </header>
  );
};

export default NavBar;
