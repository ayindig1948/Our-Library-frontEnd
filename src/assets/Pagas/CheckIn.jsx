import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import NavBar from "../Compentes/NavBar";
import { API } from "../../api";

const CheckInPage = () => {
    const { getAccessTokenSilently , user , logout } = useAuth0();

    const [title, setTitle] = useState("");
    const [authorFirstName, setAuthorFirstName] = useState("");
    const [authorLastName, setAuthorLastName] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleCheckIn = async (e) => {
        e.preventDefault();
        try {
            const token = await getAccessTokenSilently();
            const res = await fetch(API.checkinBook(), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, authorFirstName, authorLastName }),
            });

            if (!res.ok) {
                throw new Error(`Could not check in book: ${res.status} ${res.statusText}`);
            }

            setError(null);
            setMessage(`You have checked in "${title}" by ${authorFirstName} ${authorLastName}`);
        } catch (error) {
            console.error("Error checking in book:", error);
            setMessage(null);
            setError("Failed to check in the book. Please try again.");
        }
    };

    return (

        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          
                <h1 className="text-2xl font-bold text-gray-600 dark:text-white">Check In</h1>
            
            <main className="container mx-auto p-4">
                <p className="mb-4 text-gray-600 dark:text-gray-300">Check in a book here.</p>

                <form onSubmit={handleCheckIn} className="flex max-w-sm flex-col gap-3">
                    <input
                        type="text"
                        placeholder="Book Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base sm:py-2 sm:text-sm"
                    />
                    <input
                        type="text"
                        placeholder="Author First Name"
                        value={authorFirstName}
                        onChange={(e) => setAuthorFirstName(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base sm:py-2 sm:text-sm"
                    />
                    <input
                        type="text"
                        placeholder="Author Last Name"
                        value={authorLastName}
                        onChange={(e) => setAuthorLastName(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base sm:py-2 sm:text-sm"
                    />
                    <button
                        type="submit"
                        className="rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700 sm:py-2"
                    >
                        Check In
                    </button>
                </form>

                {message && <p className="mt-4 text-green-600">{message}</p>}
                {error && <p className="mt-4 text-red-600">{error}</p>}
            </main>
        </div>
    );
};

export default CheckInPage;
