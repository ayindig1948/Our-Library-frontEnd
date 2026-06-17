import NavBar from "../Components/NavBar";
import BooksList from "../Components/booksList";

const HomePage = ({ isLoading, isAuthenticated, error, login, signup, logout, user }) => {
   
    if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Loading...
      </div>
    );

  return isAuthenticated ? (
    

      <BooksList />
    
  ) : (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
         Welcome To The Library
        </h1>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Sign in to browse and check out books.
        </p>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            Error: {error.message}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={login}
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700"
          >
            Login
          </button>
          <button
            onClick={signup}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}
 
export default HomePage;