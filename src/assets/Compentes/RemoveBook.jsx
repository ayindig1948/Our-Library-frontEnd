import { useState } from "react";
import { API } from "../../api";

const RemoveBook = ({ getAccessTokenSilently }) => {
    const [bookItem, setBookItem] = useState({
        title: "",
        authorFirstName: "",
        authorLastName: "",
    });
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleChangeItem = (e) => {
        const { name, value } = e.target;
        setBookItem((prev) => ({ ...prev, [name]: value }));
    };

    const remove = async (e) => {
        e.preventDefault();
        try {
            const token = await getAccessTokenSilently();
            const res = await fetch(API.removeBook(), {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bookItem),
            });
            if (!res.ok) {
                throw new Error(`Could not delete book ${res.status} ${res.statusText}`);
            }

            setMessage(`Deleted "${bookItem.title}"`);
            setError(null);
        } catch (error) {
            console.error("Error deleting book:", error);
            setMessage(null);
            setError("Failed to delete book.");
        } finally {
            setBookItem({
                title: "",
                authorFirstName: "",
                authorLastName: "",
            });
        }
    };

    return (
        <form onSubmit={remove} className="flex max-w-sm flex-col gap-3">
            <input
                type="text"
                name="title"
                placeholder="Book Title"
                value={bookItem.title}
                onChange={handleChangeItem}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <input
                type="text"
                name="authorFirstName"
                placeholder="Author First Name"
                value={bookItem.authorFirstName}
                onChange={handleChangeItem}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <input
                type="text"
                name="authorLastName"
                placeholder="Author Last Name"
                value={bookItem.authorLastName}
                onChange={handleChangeItem}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <button
                type="submit"
                className="mt-6 cursor-pointer rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700"
            >
                Remove Book
            </button>

            {message && <p className="mt-4 text-green-600">{message}</p>}
            {error && <p className="mt-4 text-red-600">{error}</p>}
        </form>
    );
};

export default RemoveBook;
