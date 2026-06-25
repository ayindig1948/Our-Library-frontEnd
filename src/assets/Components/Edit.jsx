import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { API } from "../../api";

const EditBook = ({ book, onClose, onSaved }) => {
  const { getAccessTokenSilently, user } = useAuth0();
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [editRequest, setEditRequest] = useState({
    bookId: book.id,
    title:  "",
    description:  "",
    category: "",
  });

  const sendEditRequest = async (e) => {
    e.preventDefault();
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(API.editBook(), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editRequest),
      });
      if (!res.ok) {
        throw new Error(`Could not edit book: ${res.status} ${res.statusText}`);
      }
      setMessage(`"${book.title}" was edited successfully`);
      setError(null);
      await onSaved?.();
      onClose?.();
    } catch (error) {
      console.error("Error editing book:", error);
      setMessage(null);
      setError("Failed to edit book.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditRequest((prev) => ({ ...prev, [name]: value }));
  };

  const namespace = "https://libdemo.example.com";
  const roles = user?.[`${namespace}/roles`] || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 cursor-pointer rounded-full p-1 text-xl leading-none text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
        >
          &times;
        </button>

        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Edit "{book.title}"
        </h2>

        {roles.includes("Admin") ? (
          <form onSubmit={sendEditRequest} className="flex flex-col gap-3">
            <input
              type="text"
              name="title"
              placeholder="Book Title"
              value={editRequest.title}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base sm:py-2 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={editRequest.description}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base sm:py-2 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={editRequest.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base sm:py-2 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              className="mt-2 cursor-pointer rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700 sm:py-2"
            >
              Submit
            </button>
          </form>
        ) : (
          <p className="text-blue-600 dark:text-blue-400">
            You're not authorized to edit
          </p>
        )}

        {message && <p className="mt-4 text-green-600">{message}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default EditBook;
