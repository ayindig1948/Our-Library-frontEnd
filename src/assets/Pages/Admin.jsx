import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import AddBookCom from "../Components/AddBook";
import AddBookItem from "../Components/AddBookItem";
import BookItemCard from "../Components/BookItemCard";
import Fulfill from "../Components/Fulfill";
import RemoveBook from "../Components/RemoveBook";
import RemoveItem from "../Components/RemoveItem";
import { API } from "../../api";

const AdminPage = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [showAddBook, setShowAddBook] = useState(false);
    const [showAddNewCopy,setShowAddNewCopy]=useState(false)
    const [showFulfillBooks,setShowFulfillBooks]=useState(false)
        const [showRemoveBook,setShowRemoveBook]=useState(false)
            const [showRemoveItem,setShowRemoveItem]=useState(false)
    const [book, setBook] = useState({
        title: "",
        authorFirstName: "",
        authorLastName: "",
        description: "",
        category: "",
        numberOfItems: null,
    });
    const [bookItem,setBookItem]=useState({
        title: "",
        authorFirstName: "",
        authorLastName: "",
       numberOfItems:1,
    })
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] ?? null;
        setImageFile(file);
        setImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const uploadImage = async (token) => {
        const formData = new FormData();
        formData.append("file", imageFile);
        const res = await fetch(API.uploadImage(), {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }, // no Content-Type: browser sets multipart boundary
            body: formData,
        });
        if (!res.ok) {
            throw new Error(`Could not upload image: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        return data.url;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBook((prev) => ({ ...prev, [name]: value }));
    };
    const handleChangeItem = (e) => {
        const { name, value } = e.target;
        setBookItem((prev) => ({ ...prev, [name]: value }));
    };

    const AddBook = async (e) => {
        e.preventDefault();
        try {
            const token = await getAccessTokenSilently();

            // Upload the cover image first (if one was chosen), then send its URL with the book.
            let imageUrl = null;
            if (imageFile) {
                imageUrl = await uploadImage(token);
            }

            const res = await fetch(API.addBook(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...book, imageUrl }),
            });
            if (!res.ok) {
                throw new Error(`Could not add book: ${res.status} ${res.statusText}`);
            }
            const text = await res.text();
            const data = text ? JSON.parse(text) : null;
            setMessage(`Book "${data?.title ?? book.title}" added successfully!`);
            setError(null);
        } catch (error) {
            console.error("Error adding book:", error);
            setMessage(null);
            setError("Failed to add book.");
        } finally {
            setBook({
                title: "",
                authorFirstName: "",
                authorLastName: "",
                description: "",
                category: "",
                numberOfItems: null,
            });
            setImageFile(null);
            setImagePreview(null);
        }
    };
    const AddBookItems = async (e) => {
        e.preventDefault();
        try {
          const token = await getAccessTokenSilently();
            const res = await fetch(API.addBookItem(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bookItem),
            });
            if (!res.ok) {
                throw new Error(`Could not add book Copy: ${res.status} ${res.statusText}`);
            }
            const text = await res.text();
            const data = text ? JSON.parse(text) : null;
            setMessage(`${bookItem.numberOfItems} Copies of "${data?.title ?? bookItem.title}" added successfully!`);
            setError(null);
        } catch (error) {
            console.error("Error adding book copy:", error);
            setMessage(null);
            setError("Failed to add book copy.");
        } finally {
            setBookItem({
                title: "",
                authorFirstName: "",
                authorLastName: "",
                
                numberOfItems: null,
            });
        }
    };
      

    const namespace = "https://libdemo.example.com";
const roles = user?.[`${namespace}/roles`] || [];


if (!roles.includes("Admin")) {
  return (
    <div className="flex min-h-screen items-center justify-center text-gray-500">
      <p>You are not authorized to view this page.</p>
    </div>
  );
}

        
    return (
        <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          Welcome, <span className="capitalize">{user.name}</span>! You have admin access.
        </p>
       

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowAddBook((prev) => !prev)}
                className="w-full cursor-pointer rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700 sm:w-auto sm:py-2"
              >
                {showAddBook ? "Hide Add Book" : "Add Book"}
              </button>
              <button
                onClick={() => setShowAddNewCopy((prev) => !prev)}
                className="w-full cursor-pointer rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700 sm:w-auto sm:py-2"
              >
                {showAddNewCopy ? "Hide Add Copy" : "Add A Copy"}
              </button>
              <button
                onClick={() => setShowFulfillBooks((prev) => !prev)}
                className="w-full cursor-pointer rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700 sm:w-auto sm:py-2"
              >
                {showFulfillBooks ? "Hide books to Fulfill" : "Show books to Fulfill"}
              </button>
              <button
                onClick={() => setShowRemoveBook((prev) => !prev)}
                className="w-full cursor-pointer rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700 sm:w-auto sm:py-2"
              >
                {showRemoveBook ? "Hide Remove A book" : "Remove A book"}
              </button>
              <button
                onClick={() => setShowRemoveItem((prev) => !prev)}
                className="w-full cursor-pointer rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700 sm:w-auto sm:py-2"
              >
                {showRemoveItem ? "Hide Remove A copy" : "Remove A copy"}
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {showAddBook && (
                <AddBookCom book={book} HandleChange={handleChange} AddBook={AddBook} onFileChange={handleFileChange} preview={imagePreview} />
              )}
              {showAddNewCopy && (
                <AddBookItem book={bookItem} HandleChange={handleChangeItem} AddItem={AddBookItems} />
              )}
              {showFulfillBooks && <Fulfill />}
              {showRemoveBook && (
                <RemoveBook getAccessTokenSilently={getAccessTokenSilently} />
              )}
              {showRemoveItem && (
                <RemoveItem getAccessTokenSilently={getAccessTokenSilently} />
              )}
            </div>
            {message && <p className="mt-4 text-green-600">{message}</p>}
            {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
    );
}

export default AdminPage;
